import { Button } from "./Button";

export default {
  title: "React/Button",
  component: Button,
  argTypes: {
    primary: { control: "boolean" },
    size: {
      control: { type: "select", options: ["small", "medium", "large"] },
    },
    label: { control: "text" },
    onClick: { action: "clicked" },
  },
};

export const Primary = {
  args: {
    primary: true,
    label: "Button",
  },
};

export const Secondary = {
  args: {
    primary: false,
    label: "Button",
  },
};

export const Large = {
  args: {
    size: "large",
    label: "Button",
  },
};

export const Small = {
  args: {
    size: "small",
    label: "Button",
  },
};
