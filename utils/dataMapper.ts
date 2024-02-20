import { AlertData as Alert } from "@/components/data/AlertData";
import {
  AvatarData as Avatar,
  AvatarData as Image,
} from "@/components/data/AvatarData";
import { ChartData as Chart } from "@/components/data/ChartData";
import { ContainerData as Container } from "@/components/data/ContainerData";
import { CountdownButtonData as CountdownButton } from "@/components/data/CountdownButtonData";
import {
  SelectData as Autocomplete,
  SelectData as Select,
} from "@/components/data/SelectData";
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
  Alert,
  Select,
  Text,
  Title,
  Link,
  Button,
  CountdownButton,
  Avatar,
  NavLink,
  Badge,
  FileButton,
  Image,
  Container,
  Form: Container,
  Table,
  Autocomplete,
  AreaChart: Chart,
  BarChart: Chart,
  LineChart: Chart,
  PieChart: Chart,
  RadarChart: Chart,
  RadialChart: Chart,
};

export const showVisibilityModifier = (component: any) =>
  !Object.keys(dataMapper).includes(component.name);
