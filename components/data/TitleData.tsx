import { TextData } from "@/components/data/TextData";
import { DataProps } from "@/components/data/type";

export const TitleData = ({ component, endpoints }: DataProps) => {
  return <TextData component={component} endpoints={endpoints} />;
};
