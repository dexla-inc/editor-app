import { AccordionData as Accordion } from "@/components/data/AccordionData";
import { AutocompleteData as Autocomplete } from "@/components/data/AutocompleteData";
import {
  AvatarData as Avatar,
  AvatarData as Image,
} from "@/components/data/AvatarData";
import { ChartData as Chart } from "@/components/data/ChartData";
import {
  CheckboxData as Checkbox,
  CheckboxData as Switch,
} from "@/components/data/CheckboxData";
import { CheckboxGroupData as CheckboxGroup } from "@/components/data/CheckboxGroupData";
import { CodeEmbedData as CodeEmbed } from "@/components/data/CodeEmbedData";
import { ContainerData as Container } from "@/components/data/ContainerData";
import { CountdownButtonData as CountdownButton } from "@/components/data/CountdownButtonData";
import { DateInputData as DateInput } from "@/components/data/DateInputData";
import {
  FormFieldsBuilder as Alert,
  FormFieldsBuilder as ButtonIcon,
  FormFieldsBuilder as FileUpload,
  FormFieldsBuilder as Icon,
} from "@/components/data/forms/FormFieldsBuilder";
import { GoogleMapData as GoogleMap } from "@/components/data/GoogleMapData";
import { ModalData as Modal } from "@/components/data/ModalData";
import { ProgressData as Progress } from "@/components/data/ProgressData";
import { SelectData as Select } from "@/components/data/SelectData";
import {
  TextData as AccordionItem,
  TextData as Badge,
  TextData as Button,
  TextData as FileButton,
  TextData as Link,
  TextData as NavLink,
  TextData as Text,
  TextData as Title,
} from "@/components/data/TextData";
import {
  TextInputData as Input,
  TextInputData as RadioItem,
  TextInputData as Textarea,
} from "@/components/data/TextInputData";

export const dataMapper = {
  Alert,
  Select,
  Autocomplete,
  Text,
  Title,
  Link,
  Button,
  ButtonIcon,
  CountdownButton,
  Avatar,
  NavLink,
  Modal,
  Drawer: Modal,
  Badge,
  FileButton,
  Input,
  DateInput,
  Switch,
  Checkbox,
  CheckboxItem: Checkbox,
  CheckboxGroup,
  Radio: Input,
  RadioItem,
  Textarea,
  Image,
  Container,
  Form: Container,
  Card: Container,
  Accordion,
  AccordionItem,
  Progress,
  GoogleMap,
  Icon,
  AreaChart: Chart,
  BarChart: Chart,
  LineChart: Chart,
  PieChart: Chart,
  RadarChart: Chart,
  RadialChart: Chart,
  CodeEmbed,
  FileUpload,
};
