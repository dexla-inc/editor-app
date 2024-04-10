import { CommonData as Alert } from "@/components/data/CommonData";
import { ModalData as Modal } from "@/components/data/ModalData";
import {
  AvatarData as Avatar,
  AvatarData as Image,
} from "@/components/data/AvatarData";
import { ChartData as Chart } from "@/components/data/ChartData";
import { ContainerData as Container } from "@/components/data/ContainerData";
import { CountdownButtonData as CountdownButton } from "@/components/data/CountdownButtonData";
import { GoogleMapData as GoogleMap } from "@/components/data/GoogleMapData";
import {
  SelectData as Autocomplete,
  SelectData as Select,
} from "@/components/data/SelectData";
import { TableData as Table } from "@/components/data/TableData";
import { DateInputData as DateInput } from "@/components/data/DateInputData";
import {
  TextInputData as Textarea,
  TextInputData as Input,
} from "@/components/data/TextInputData";
import {
  CheckboxData as Checkbox,
  CheckboxData as Switch,
} from "@/components/data/CheckboxData";
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
  Modal,
  Badge,
  FileButton,
  Input,
  DateInput,
  Switch,
  Checkbox,
  Radio: Input,
  RadioItem: Input,
  Textarea,
  Image,
  Container,
  Form: Container,
  Card: Container,
  Table,
  Autocomplete,
  GoogleMap,
  AreaChart: Chart,
  BarChart: Chart,
  LineChart: Chart,
  PieChart: Chart,
  RadarChart: Chart,
  RadialChart: Chart,
};
