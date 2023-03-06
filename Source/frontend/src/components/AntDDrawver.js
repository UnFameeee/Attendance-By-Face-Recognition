import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Col, Drawer, Form, Row, Select, Space } from "antd";
import AntDFormField from "./AntDFormField";
import FormTextField from "./FormTextField";
function AntDDrawver({ open, setOpen }) {
  
  const { Option } = Select;
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Please enter full name"),
    role: Yup.string().required("Please chose the role"),
    phone: Yup.string().required("Please enter phone number"),
    address: Yup.string().required("Please enter the address"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter the email"),
  });
  const [form] = Form.useForm();
  const initialValues = {
    fullName: "",
    role: "",
    phone: "",
    address: "",
    email: "",
    type: "",
  };
  const handleSubmit = () => {
    console.log(form.getFieldsValue());
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Drawer
          width={720}
          zIndex="1101"
          className="table-action-drawer"
          title="Edit"
          placement="right"
          onClose={onClose}
          open={open}
          form={form}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <AntDFormField
                  name="fullName"
                  label="Full Name"
                  placeholder="Please enter full name"
                />
              </Col>
              <Col span={12}>
                <AntDFormField
                  name="role"
                  label="Role"
                  placeholder="Please chose the role"
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <AntDFormField
                  name="phone"
                  label="Phone"
                  isSelection ={true}
                  placeholder="Please enter phone number"
                />
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[
                    {
                      required: true,
                      message: "Please choose the type",
                    },
                  ]}
                >
                  <Select
                    onChange={handleChange}
                    options={[
                      {
                        value: 'jack',
                        label: 'Jack',
                      },
                      {
                        value: 'lucy',
                        label: 'Lucy',
                      },
                      {
                        value: 'Yiminghe',
                        label: 'yiminghe',
                      },
                      {
                        value: 'disabled',
                        label: 'Disabled',
                        disabled: true,
                      },
                    ]}
                 />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <AntDFormField
                  name="address"
                  label="Address"
                  placeholder="Please enter the address"
                />
              </Col>
              <Col span={12}>
                <AntDFormField
                  name="email"
                  label="Email"
                  placeholder="Please enter the email"
                />
              </Col>
            </Row>
          </Form>
        </Drawer>
      </Formik>
    </>
  );
}

export default AntDDrawver;
