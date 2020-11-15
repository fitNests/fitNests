import React from "react";
import { Layout, Row, Col, Select, message } from "antd";
import { Form, Input, InputNumber, Button } from "antd";
import "../App.css";
import { useHistory } from "react-router-dom"; //react hook
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

//Form Layout
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not validate email!",
    number: "${label} is not a validate number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export default function CreateTraineeProfile() {
  const history = useHistory();

  //return back to the list of users
  const returnBackToTraineeProfile = () => history.push("/user");

  const [form] = Form.useForm();

  const onGenderChange = (value) => {
    switch (value) {
      case "male":
        form.setFieldsValue({ note: "Hi, man!" });
        return;
      case "female":
        form.setFieldsValue({ note: "Hi, lady!" });
        return;
      case "other":
        form.setFieldsValue({ note: "Hi there!" });
        return;
      default:
        form.setFieldsValue({ note: "Hi there!" });
        return;
    }
  };

  const onPlanChange = (value) => {
    switch (value) {
      case "planA":
        form.setFieldsValue({ plan: "planA" });
        return;
      case "planB":
        form.setFieldsValue({ plan: "planB" });
        return;
      default:
        form.setFieldsValue({ plan: value });
        return;
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  //For Testing
  const onFill = () => {
    form.setFieldsValue({
      name: "testTrainee",
      email: "email@gmail.com",
      age: 24,
      address: "address at address street",
      gender: "male",
    });
  };

  const onFinish = (values) => {
    //User created popup
    console.log(values);
    //TODO Handle BackEnd request for this form submittion

    //send user date to the backend
    axios
      .post("http://localhost:5000/trainee/add", values)
      .then((res) => console.log(res.data));

    message.info("User Created!");
    window.history.back();
    //todo in the future - prevent same person from applying using the same email
  };

  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Row type="flex">
        <Col span={4}>
          <ArrowLeftOutlined
            onClick={returnBackToTraineeProfile}
            style={{ fontSize: "30px" }}
          />
        </Col>
        <Col span={14}>
          <h1> Create New Trainee</h1>
        </Col>
      </Row>
      <Col span={16}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={"name"}
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"email"}
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"age"}
            label="Age"
            rules={[
              {
                type: "number",
                required: true,
                min: 0,
                max: 99,
              },
            ]}
          >
            <InputNumber style={{ float: "left", width: "10%" }} />
          </Form.Item>
          <Form.Item
            name={"address"}
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"gender"}
            label="Gender"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onGenderChange}
              allowClear
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
            </Select>
          </Form.Item>

          <Form.Item name={"plan"} label="Plan" rules={[{ required: true }]}>
            <Select
              placeholder="Select a trainee plan "
              onChange={onPlanChange}
              allowClear
            >
              <Option value="planA">planA</Option>
              <Option value="planB">planB</Option>
              <Option value="other">other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.plan !== currentValues.plan
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue("plan") === "other" ? (
                <Form.Item
                  name="customizePlan"
                  label="Customize Plan"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="link" htmlType="button" onClick={onFill}>
              Fill form
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Layout>
  );
}
