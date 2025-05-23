import { GPT35_TURBO_16K_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { prisma } from "@/utils/prisma";
import { getEntitiesPrompt } from "@/utils/prompts";
import { Stopwatch } from "@/utils/stopwatch";
import { faker } from "@faker-js/faker";
import random from "lodash.random";
import sampleSize from "lodash.samplesize";

function callFakerFunction(funcString: string) {
  try {
    const fakerFunction = new Function("faker", `return faker.${funcString};`)(
      faker,
    );
    return fakerFunction();
  } catch (error) {
    return faker.random.word();
  }
}

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    // start a timer
    const timer = Stopwatch.StartNew();

    const data: {
      id: string;
      appDescription: string;
      appIndustry: string;
      accessToken: string;
      timer: Stopwatch;
    } = body;

    const { appDescription, appIndustry, ...restData } = data;

    const response = await openai.chat.completions.create({
      model: GPT35_TURBO_16K_MODEL,
      // response_format: {
      //   type: "json_object",
      // },
      stream: false,
      messages: [
        {
          role: "user",
          content: getEntitiesPrompt(data),
        },
      ],
    });

    const message = response.choices[0].message;
    const content = JSON.parse(message.content ?? "{}");

    const projectData = Object.keys(content.entities).reduce((acc, key) => {
      const entity = content.entities[key];

      const callFakerFuncs = (obj: any): any => {
        return Object.keys(obj).reduce((acc, curr) => {
          const val = obj[curr];
          if (typeof val === "string" && val.startsWith("faker.")) {
            const funcString = val.replace("faker.", "");
            return {
              ...acc,
              [curr]: callFakerFunction(funcString),
            };
          }

          if (Array.isArray(val)) {
            return {
              ...acc,
              [curr]: val.map((v) => {
                if (typeof v === "string" && v.startsWith("faker.")) {
                  const funcString = v.replace("faker.", "");
                  return callFakerFunction(funcString);
                }

                return v;
              }),
            };
          }

          if (typeof val === "object") {
            return {
              ...acc,
              [curr]: callFakerFuncs(val),
            };
          }

          return {
            ...acc,
            [curr]: val,
          };
        }, {});
      };

      return {
        ...acc,
        [key]: Array(10)
          .fill(null)
          .map(() => callFakerFuncs(entity)),
      };
    }, {});

    const transformEntityReferences = (_data: any): any => {
      const getEntityValue = (val: any) => {
        let newVal: any = val;
        const [entityType, entityMethod] = val
          .replace("entity.", "")
          .split(".");

        // @ts-ignore
        const entityData = projectData[entityType];
        if (entityMethod === "list") {
          newVal = sampleSize(entityData, random(0, entityData.length - 1))
            .map((d: any) => d.id)
            .filter((_: any, i: number) => i < 2);
        }

        if (entityMethod === "item") {
          newVal = sampleSize(entityData, 1)[0].id;
        }

        return newVal;
      };

      return Object.keys(_data).reduce((acc, key) => {
        const val = _data[key];
        if (typeof val === "string" && val.startsWith("entity.")) {
          return {
            ...acc,
            [key]: getEntityValue(val),
          };
        }

        if (Array.isArray(val)) {
          return {
            ...acc,
            [key]: val.map((v) => {
              if (typeof v === "string" && v.startsWith("entity.")) {
                return getEntityValue(v);
              }

              if (typeof v === "object") {
                return transformEntityReferences(v);
              }

              return v;
            }),
          };
        }

        if (typeof val === "object") {
          return {
            ...acc,
            [key]: transformEntityReferences(val),
          };
        }

        return {
          ...acc,
          [key]: val,
        };
      }, {});
    };

    const transformedData = Object.keys(projectData).reduce((acc, key) => {
      // @ts-ignore
      const entityData = projectData[key];

      return {
        ...acc,
        [key]: entityData.map((d: any) => {
          return transformEntityReferences(d);
        }),
      };
    }, {});

    const prismaResponse = await prisma.project.create({
      data: {
        id: data.id,
        entities: content.entities,
        data: transformedData,
      },
    });

    return Response.json({ id: data.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
