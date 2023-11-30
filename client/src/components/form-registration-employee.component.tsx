import React from 'react';
import { DatePicker, Flex, Input, Radio, Select } from 'antd';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  BankOutlined,
  HomeOutlined,
  IdcardOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { IEmployeeRegistrationPayload } from '../interfaces/client.interface';
import { Typography } from 'antd';
const { Title } = Typography;

interface RegistrationEmployeeFormFieldsProps {
  control: Control<any>;
  isRegistrationFailed: boolean;
  errors: FieldErrors<IEmployeeRegistrationPayload>;
}
const RegistrationEmployeeFormFields: React.FC<
  RegistrationEmployeeFormFieldsProps
> = ({ control, isRegistrationFailed, errors }) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 10,
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 50,
        paddingRight: 50,
      }}
    >
      <Title level={4} style={{ color: '#555', marginTop: 0, paddingTop: 0 }}>
        Basic Information
      </Title>
      <Flex gap={5} className="registration-employee-row1">
        {/* FIRST NAME */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            First name <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="first_name"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Invalid First name',
              },
              minLength: {
                message: 'Invalid First name',
                value: 2,
              },
              maxLength: {
                message: 'Invalid First name',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.first_name && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.first_name.message}
            </div>
          )}
        </div>
        {/* MIDDLE NAME */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Middle name
          </p>
          <Controller
            name="middle_name"
            control={control}
            rules={{
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'Invalid Middle name',
              },
              minLength: {
                message: 'Invalid Middle name',
                value: 2,
              },
              maxLength: {
                message: 'Invalid Middle name',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.middle_name && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.middle_name.message}
            </div>
          )}
        </div>
        {/* LAST NAME */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Last name <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="last_name"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'Invalid Last name',
              },
              minLength: {
                message: 'Invalid Last name',
                value: 2,
              },
              maxLength: {
                message: 'Invalid Last name',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.last_name && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.last_name.message}
            </div>
          )}
        </div>
        {/* SUFFIX */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Suffix <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="suffix"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'Invalid Suffix',
              },
              minLength: {
                message: 'Invalid Suffix',
                value: 2,
              },
              maxLength: {
                message: 'Invalid Suffix',
                value: 6,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.suffix && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.suffix.message}
            </div>
          )}
        </div>
        {/* CIVIL STATUS */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Civil status <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="civil_status"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <Select
                showSearch
                size="large"
                placeholder="Select a civil status"
                optionFilterProp="children"
                options={[
                  {
                    value: 'single',
                    label: 'Single',
                  },
                  {
                    value: 'married',
                    label: 'Married',
                  },
                  {
                    value: 'divorced',
                    label: 'Divorced',
                  },
                  {
                    value: 'widowed',
                    label: 'Widowed',
                  },
                  {
                    value: 'separated',
                    label: 'Separated',
                  },
                ]}
                style={{ width: '100%' }}
                {...field}
              />
            )}
          />
          {errors.civil_status && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.civil_status.message}
            </div>
          )}
        </div>
      </Flex>

      <Flex gap={5} className="registration-employee-row2">
        {/* EMAIL */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Email <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid Email',
              },
              minLength: {
                message: 'Invalid Email',
                value: 10,
              },
              maxLength: {
                message: 'Invalid Email',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.email && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.email.message}
            </div>
          )}
        </div>
        {/* PHONE NUMBER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Phone number <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="phone_number"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Invalid Phone number',
              },
              minLength: {
                message: 'Invalid Phone number',
                value: 10,
              },
              maxLength: {
                message: 'Invalid Phone number',
                value: 10,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                addonBefore="+63"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.phone_number && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.phone_number.message}
            </div>
          )}
        </div>
        {/* BIRTHDATE */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Birthdate <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="birthdate"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <DatePicker size="large" style={{ width: '100%' }} {...field} />
            )}
          />
          {errors.birthdate && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.birthdate.message}
            </div>
          )}
        </div>
        {/* BLOOD TYPE */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Blood type
          </p>
          <Controller
            name="blood_type"
            control={control}
            render={({ field }) => (
              <Select
                showSearch
                size="large"
                placeholder="Select a Blood type"
                optionFilterProp="children"
                options={[
                  {
                    value: 'A+',
                    label: 'A+',
                  },
                  {
                    value: 'A-',
                    label: 'A-',
                  },
                  {
                    value: 'B+',
                    label: 'B+',
                  },
                  {
                    value: 'B-',
                    label: 'B-',
                  },
                  {
                    value: 'AB+',
                    label: 'AB+',
                  },
                  {
                    value: 'AB-',
                    label: 'AB-',
                  },
                  {
                    value: 'O+',
                    label: 'O+',
                  },
                  {
                    value: 'O-',
                    label: 'O-',
                  },
                ]}
                style={{ width: '100%' }}
                {...field}
              />
            )}
          />
          {errors.blood_type && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.blood_type.message}
            </div>
          )}
        </div>
        {/* GENDER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Gender <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="gender"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <Radio.Group
                buttonStyle="solid"
                style={{ width: '100%' }}
                size="large"
                {...field}
              >
                <Radio.Button value="MALE">Male</Radio.Button>
                <Radio.Button value="FEMALE">Female</Radio.Button>
                <Radio.Button value="OTHERS">Others</Radio.Button>
              </Radio.Group>
            )}
          />
          {errors.gender && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.gender.message}
            </div>
          )}
        </div>
      </Flex>

      <Flex gap={5} className="registration-employee-row3">
        {/* PRESENT ADDRESS */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Present address <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="present_address"
            control={control}
            rules={{
              required: 'This field is required',
              minLength: {
                message: 'Invalid Address',
                value: 15,
              },
              maxLength: {
                message: 'Invalid Address',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<HomeOutlined />}
                {...field}
              />
            )}
          />
          {errors.present_address && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.present_address.message}
            </div>
          )}
        </div>
        {/* PERMANENT ADDRESS */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Permanent address <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="permanent_address"
            control={control}
            rules={{
              required: 'This field is required',
              minLength: {
                message: 'Invalid Address',
                value: 15,
              },
              maxLength: {
                message: 'Invalid Address',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<HomeOutlined />}
                {...field}
              />
            )}
          />
          {errors.permanent_address && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.permanent_address.message}
            </div>
          )}
        </div>
      </Flex>

      <Title level={4} style={{ color: '#555' }}>
        School
      </Title>
      <Flex gap={5} className="registration-employee-row4">
        {/* DEPARTMENT */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Department <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="department"
            control={control}
            rules={{
              required: 'This field is required',
              minLength: {
                message: 'Invalid Department',
                value: 3,
              },
              maxLength: {
                message: 'Invalid Department',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<BankOutlined />}
                {...field}
              />
            )}
          />
          {errors.department && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.department.message}
            </div>
          )}
        </div>
        {/* SCHOOL ID */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            School ID <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="school_id"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^(?!-)[0-9-]+(?<!-)$/,
                message: 'Invalid School ID',
              },
              minLength: {
                message: 'Invalid School ID',
                value: 5,
              },
              maxLength: {
                message: 'Invalid School ID',
                value: 20,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<IdcardOutlined />}
                {...field}
              />
            )}
          />
          {errors.school_id && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.school_id.message}
            </div>
          )}
        </div>
      </Flex>

      <Title level={4} style={{ color: '#555' }}>
        Accounts
      </Title>
      <Flex gap={5} className="registration-employee-row5">
        {/* SSS NUMBER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            SSS No. <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="sss_no"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^(?!-)[0-9-]+(?<!-)$/,
                message: 'Invalid SSS No.',
              },
              minLength: {
                message: 'Invalid SSS No.',
                value: 9,
              },
              maxLength: {
                message: 'Invalid SSS No.',
                value: 25,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<NumberOutlined />}
                {...field}
              />
            )}
          />
          {errors.sss_no && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.sss_no.message}
            </div>
          )}
        </div>
        {/* PHILHEALTH NUMBER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Philhealth No.
          </p>
          <Controller
            name="philhealth_no"
            control={control}
            rules={{
              pattern: {
                value: /^(?!-)[0-9-]+(?<!-)$/,
                message: 'Invalid Philhealth No.',
              },
              minLength: {
                message: 'Invalid Philhealth No.',
                value: 9,
              },
              maxLength: {
                message: 'Invalid Philhealth No.',
                value: 25,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<NumberOutlined />}
                {...field}
              />
            )}
          />
          {errors.philhealth_no && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.philhealth_no.message}
            </div>
          )}
        </div>
        {/* PAG-IBIG NUMBER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Pagibig No.
          </p>
          <Controller
            name="pagibig_no"
            control={control}
            rules={{
              pattern: {
                value: /^(?!-)[0-9-]+(?<!-)$/,
                message: 'Invalid Pagibig No.',
              },
              minLength: {
                message: 'Invalid Pagibig No.',
                value: 9,
              },
              maxLength: {
                message: 'Invalid Pagibig No.',
                value: 25,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<NumberOutlined />}
                {...field}
              />
            )}
          />
          {errors.pagibig_no && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.pagibig_no.message}
            </div>
          )}
        </div>
        {/* BPI ACCOUNT NUMBER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            BPI Account No.
          </p>
          <Controller
            name="bpi_atm_account_no"
            control={control}
            rules={{
              pattern: {
                value: /^[0-9]+$/,
                message: 'Invalid BPI Account No.',
              },
              minLength: {
                message: 'Invalid BPI Account No.',
                value: 9,
              },
              maxLength: {
                message: 'Invalid BPI Account No.',
                value: 25,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<NumberOutlined />}
                {...field}
              />
            )}
          />
          {errors.bpi_atm_account_no && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.bpi_atm_account_no.message}
            </div>
          )}
        </div>
        {/* TIN  NUMBER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>TIN</p>
          <Controller
            name="tin"
            control={control}
            rules={{
              pattern: {
                value: /^[0-9]+$/,
                message: 'Invalid TIN',
              },
              minLength: {
                message: 'Invalid TIN',
                value: 9,
              },
              maxLength: {
                message: 'Invalid TIN',
                value: 25,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<NumberOutlined />}
                {...field}
              />
            )}
          />
          {errors.tin && (
            <div style={{ color: 'red', padding: 5 }}>{errors.tin.message}</div>
          )}
        </div>
        {/* RVM RETIREMENT  NUMBER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            RVM Retirment No.
          </p>
          <Controller
            name="rvm_retirement_no"
            control={control}
            rules={{
              pattern: {
                value: /^(?!-)[0-9-]+(?<!-)$/,
                message: 'Invalid Retirement No.',
              },
              minLength: {
                message: 'Invalid Retirement No.',
                value: 9,
              },
              maxLength: {
                message: 'Invalid Retirement No.',
                value: 25,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                prefix={<NumberOutlined />}
                {...field}
              />
            )}
          />
          {errors.rvm_retirement_no && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.rvm_retirement_no.message}
            </div>
          )}
        </div>
      </Flex>

      <Title level={4} style={{ color: '#555' }}>
        Others
      </Title>
      <Flex gap={5} className="registration-employee-row6">
        {/* DATE HIRED */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Date hired <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="date_hired"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <DatePicker size="large" style={{ width: '100%' }} {...field} />
            )}
          />
          {errors.date_hired && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.date_hired.message}
            </div>
          )}
        </div>
        {/* DATE RESIGNED */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Date resigned
          </p>
          <Controller
            name="date_resigned"
            control={control}
            render={({ field }) => (
              <DatePicker size="large" style={{ width: '100%' }} {...field} />
            )}
          />
          {errors.date_resigned && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.date_resigned.message}
            </div>
          )}
        </div>
      </Flex>

      <Flex gap={5} className="registration-employee-row7">
        {/* PERSONNEL CATEGORY */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Personnel Category <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="personnel_category"
            control={control}
            rules={{
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Invalid Personnel Category',
              },
              minLength: {
                message: 'Invalid Personnel Category',
                value: 2,
              },
              maxLength: {
                message: 'Invalid Personnel Category',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.personnel_category && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.personnel_category.message}
            </div>
          )}
        </div>

        {/* MAIN EMPLOYER */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Main Employer <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="main_employer"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Invalid Main Employer',
              },
              minLength: {
                message: 'Invalid Main Employer',
                value: 2,
              },
              maxLength: {
                message: 'Invalid Main Employer',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.main_employer && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.main_employer.message}
            </div>
          )}
        </div>

        {/* ADDRESS */}
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Address <span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            name="address"
            control={control}
            rules={{
              required: 'This field is required',
              minLength: {
                message: 'Invalid Address',
                value: 2,
              },
              maxLength: {
                message: 'Invalid Address',
                value: 255,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                status={isRegistrationFailed ? 'error' : ''}
                {...field}
              />
            )}
          />
          {errors.address && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.address.message}
            </div>
          )}
        </div>
      </Flex>
    </div>
  );
};

export default RegistrationEmployeeFormFields;
