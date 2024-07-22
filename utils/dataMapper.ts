import {
  FormFieldsBuilder as Alert,
  FormFieldsBuilder as Icon,
  FormFieldsBuilder as ButtonIcon,
} from "@/components/data/forms/FormFieldsBuilder";
import { ModalData as Modal } from "@/components/data/ModalData";
import {
  AvatarData as Avatar,
  AvatarData as Image,
} from "@/components/data/AvatarData";
import { ChartData as Chart } from "@/components/data/ChartData";
import { ContainerData as Container } from "@/components/data/ContainerData";
import { CheckboxGroupData as CheckboxGroup } from "@/components/data/CheckboxGroupData";
import { CountdownButtonData as CountdownButton } from "@/components/data/CountdownButtonData";
import { ProgressData as Progress } from "@/components/data/ProgressData";
import { GoogleMapData as GoogleMap } from "@/components/data/GoogleMapData";
import { SelectData as Select } from "@/components/data/SelectData";
import { AutocompleteData as Autocomplete } from "@/components/data/AutocompleteData";
import { DateInputData as DateInput } from "@/components/data/DateInputData";
import {
  TextInputData as Textarea,
  TextInputData as Input,
  TextInputData as RadioItem,
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
  Progress,
  GoogleMap,
  Icon,
  AreaChart: Chart,
  BarChart: Chart,
  LineChart: Chart,
  PieChart: Chart,
  RadarChart: Chart,
  RadialChart: Chart,
};
