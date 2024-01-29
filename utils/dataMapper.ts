import {
  AvatarData as Avatar,
  AvatarData as Image,
} from "@/components/data/AvatarData";
import { ChartData as Chart } from "@/components/data/ChartData";
import { ContainerData as Container } from "@/components/data/ContainerData";
import { SelectData as Select } from "@/components/data/SelectData";
import { TableData as Table } from "@/components/data/TableData";
import {
  TextData as Badge,
  TextData as Button,
  TextData as FileButton,
  TextData as Link,
  TextData as NavLink,
  TextData as Text,
  TextData as Title,
} from "@/components/data/TextData";

export const dataMapper = {
  Select,
  Text,
  Title,
  Link,
  Button,
  Avatar,
  NavLink,
  Badge,
  FileButton,
  Image,
  Container,
  Form: Container,
  Table,
  AreaChart: Chart,
  BarChart: Chart,
  LineChart: Chart,
  PieChart: Chart,
  RadarChart: Chart,
  RadialChart: Chart,
};

export const showVisibilityModifier = (component: any) =>
  !Object.keys(dataMapper).includes(component.name);
