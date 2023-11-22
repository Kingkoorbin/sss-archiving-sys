import React from "react";
import { DatePicker, Flex, Input, Radio } from "antd";
import { Control, Controller } from "react-hook-form";
import { BankOutlined, HomeOutlined, IdcardOutlined, PhoneOutlined } from "@ant-design/icons";

interface RegistrationEmployeeFormFieldsProps {
    control: Control<any>;
    isRegistrationFailed: boolean;
}

const RegistrationEmployeeFormFields: React.FC<RegistrationEmployeeFormFieldsProps> = ({
    control,
    isRegistrationFailed,
}) => {
    return (
        <>

            <Flex gap={5} justify="space-between">
                <div>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        First name
                    </p>
                    <Controller
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="middle"
                                placeholder="Enter"
                                status={isRegistrationFailed ? "error" : ""}
                                {...field}
                            />
                        )}
                    />
                </div>
                <div>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        Middle name
                    </p>
                    <Controller
                        name="middle_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="middle"
                                placeholder="Enter"
                                status={isRegistrationFailed ? "error" : ""}
                                {...field}
                            />
                        )}
                    />
                </div>
                <div>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        Last name
                    </p>
                    <Controller
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="middle"
                                placeholder="Enter"
                                status={isRegistrationFailed ? "error" : ""}
                                {...field}
                            />
                        )}
                    />
                </div>
            </Flex>

            <Flex gap={5} justify="space-between">
                <div style={{ width: "50%" }}>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        Present address
                    </p>
                    <Controller
                        name="present_address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="middle"
                                placeholder="Enter"
                                status={isRegistrationFailed ? "error" : ""}
                                prefix={<HomeOutlined />}
                                {...field}
                            />
                        )}
                    />
                </div>
                <div style={{ width: "50%" }}>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        Permanent address
                    </p>
                    <Controller
                        name="permanent_address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="middle"
                                placeholder="Enter"
                                status={isRegistrationFailed ? "error" : ""}
                                prefix={<HomeOutlined />}
                                {...field}
                            />
                        )}
                    />
                </div>

            </Flex>
            <Flex gap={5} justify="space-between">
                <div style={{ width: "50%" }}>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        Department
                    </p>
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="middle"
                                placeholder="Enter"
                                status={isRegistrationFailed ? "error" : ""}
                                prefix={<BankOutlined />}
                                {...field}
                            />
                        )}
                    />
                </div>
                <div style={{ width: "50%" }}>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        School ID
                    </p>
                    <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="middle"
                                placeholder="Enter"
                                status={isRegistrationFailed ? "error" : ""}
                                prefix={<IdcardOutlined />}
                                {...field}
                            />
                        )}
                    />
                </div>
            </Flex>
            <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                Contact Number
            </p>
            <Controller
                name="phone_number"
                control={control}
                render={({ field }) => (
                    <Input
                        size="middle"
                        placeholder="Enter"
                        status={isRegistrationFailed ? "error" : ""}
                        prefix={<PhoneOutlined />}
                        {...field}
                    />
                )}
            />
            <Flex gap={5} justify="space-between">
                <div style={{ width: "50%" }}>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        Birthdate
                    </p>
                    <Controller
                        name="birthdate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker size="middle" style={{ width: '100%' }} {...field} />
                        )}
                    />
                </div>
                <div style={{ width: "50%" }}>
                    <p style={{ padding: 0, color: "GrayText", fontSize: 12 }}>
                        Gender
                    </p>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Radio.Group defaultValue="MALE" buttonStyle="solid" style={{ width: '100%' }} {...field}  >
                                <Radio.Button value="MALE">Male</Radio.Button>
                                <Radio.Button value="FEMALE">Female</Radio.Button>
                                <Radio.Button value="OTHERS">Others</Radio.Button>
                            </Radio.Group>
                        )}
                    />
                </div>
            </Flex>
        </>
    );
};

export default RegistrationEmployeeFormFields;
