import React, { useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import { Avatar, Box } from "@chakra-ui/react";
import { anTDTableDumpData } from "../pages/test/dumbTableData";

function AntdTable() {
  const data = [
    {
      key: "1",
      name: "John Browndsad",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      filters: [
        {
          text: "Cinderella Crowhurst",
          value: "Cinderella Crowhurst",
        },
        {
          text: "Jim",
          value: "Jim",
        },
      ],
      filterMode: "menu",
      filterSearch: true,
      filteredValue: filteredInfo.fullName || null,
      render: (text) => <a>{text}</a>,
      onFilter: (value, record) => record.fullName.indexOf(value) === 0,
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      sortOrder: sortedInfo.columnKey === "fullName" ? sortedInfo.order : null,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      onFilter: (value, record) => record.role.indexOf(value) === 0,
      sorter: (a, b) => a.role.length - b.role.length,
      sortOrder: sortedInfo.columnKey === "role" ? sortedInfo.order : null,
    },
    {
        title: "Phone",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        onFilter: (value, record) => record.phoneNumber.indexOf(value) === 0,
        sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
        sortOrder: sortedInfo.columnKey === "phoneNumber" ? sortedInfo.order : null,
      },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      onFilter: (value, record) => record.address.indexOf(value) === 0,
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
    },
    {
      title: "Picture",
      key: "picture",
      dataIndex: "picture",
      onFilter: (value, record) => record.picture.indexOf(value) === 0,
      render:(record) => <Avatar src={record} /> ,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  return (
    <>
      <Box>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Box>
      <Table
        columns={columns}
        dataSource={anTDTableDumpData}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        onChange={handleChange}
      />
    </>
  );
}

export default AntdTable;
