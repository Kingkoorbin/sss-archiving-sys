import axios from 'axios';
import StaffNavbar from '../../../components/nav-staff.component';
import {
  IEmployeeProfile,
  IWorkHistory,
} from '../../../interfaces/client.interface';
import { useEffect, useState } from 'react';
import { Card, Divider, Flex, Tooltip, message } from 'antd';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../../interfaces/api.interface';
import { API_BASE_URL } from '../../../const/api.const';
import { useLocation, useNavigate } from 'react-router-dom';
import avatar from '../../../assets/avatar.png';
import { isEmpty } from '../../../utils/util';
import moment from 'moment';

interface IState {
  employee?: IEmployeeProfile;
  isSuccessCreatingEmployee: boolean;
  isSuccessCreatingWorkExperience: boolean;
  toggleWorkExperienceSection: boolean;
  workExperience?: IWorkHistory[];
}

function StaffEmployeePreview() {
  const [state, setState] = useState<IState>({
    employee: undefined,
    isSuccessCreatingEmployee: false,
    isSuccessCreatingWorkExperience: false,
    toggleWorkExperienceSection: true,
    workExperience: undefined,
  });
  const { state: locationState }: { state: IEmployeeProfile } = useLocation();
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );

  const onGeAllWorkExperience = async () => {
    const response: { data: IEmployeeProfile } = await axios.get(
      `${API_BASE_URL}/api/client/v1/information`,
      {
        params: {
          searchKeyword: locationState.school_id,
        },
        headers: {
          Authorization: `Bearer ${getAuthResponse?.access_token}`,
        },
      }
    );

    setState((prev) => ({
      ...prev,
      workExperience: response.data.work_history.reverse(),
    }));
  };

  const getEmployeeInfo = async () => {
    try {
      const response: { data: IEmployeeProfile } = await axios.get(
        `${API_BASE_URL}/api/client/v1/information`,
        {
          params: {
            searchKeyword: locationState.school_id,
          },
          headers: {
            Authorization: `Bearer ${getAuthResponse?.access_token}`,
          },
        }
      );

      setState((prev) => ({
        ...prev,
        employee: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployeeInfo();
    onGeAllWorkExperience();
  }, []);

  return (
    <>
      {contextHolder}
      <StaffNavbar />

      <div style={{ padding: '50px', background: '#fbfbff' }}>
        <Flex justify="center">
          <div
            style={{
              background: 'white',
              padding: 50,
              width: 800,
              borderRadius: 20,
            }}
          >
            <Flex gap={30} justify="space-between" align="center">
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                  }}
                >
                  Suffix
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.suffix}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                  }}
                >
                  First name
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.first_name}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                  }}
                >
                  Last name
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.last_name}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                  }}
                >
                  Middle name
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.middle_name}
                </p>
              </div>
            </Flex>

            <Divider dashed />
            <Flex gap={30} align="center">
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                  }}
                >
                  Gender
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.gender}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Birthday
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.birthdate}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Civil Status
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.civil_status}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Blood type
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.blood_type}
                </p>
              </div>
            </Flex>

            <Divider dashed />

            <Flex gap={30} align="center">
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Phone No.
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.phone_number}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Email
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.email}
                </p>
              </div>
            </Flex>

            <Divider dashed />

            <Flex gap={30} align="center">
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Present Address
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.present_address}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Permanent Address
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.permanent_address}
                </p>
              </div>
            </Flex>

            <Divider dashed />

            <Flex gap={30} align="center">
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Main Employer
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.main_employer}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Address
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.address}
                </p>
              </div>
            </Flex>

            <Divider dashed />

            <Flex gap={30} align="center">
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  School ID
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.school_id}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Department
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.department}
                </p>
              </div>
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Personnel Category
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.personnel_category}
                </p>
              </div>
            </Flex>

            <Divider dashed />

            <Flex gap={30} align="center">
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  SSS No.
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.sss_no ?? 'N/A'}
                </p>
              </div>

              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Philhealth No.
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.philhealth_no ?? 'N/A'}
                </p>
              </div>

              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Pag-ibig No.
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.pagibig_no ?? 'N/A'}
                </p>
              </div>

              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  TIN No.
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.tin ?? 'N/A'}
                </p>
              </div>

              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  RVM Retirement No.
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.rvm_retirement_no ?? 'N/A'}
                </p>
              </div>

              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  BPI ATM No.
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.bpi_atm_account_no ?? 'N/A'}
                </p>
              </div>
            </Flex>

            <Divider dashed />
            <Flex gap={30} align="center">
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Date hired
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.date_hired}
                </p>
              </div>

              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 11,
                    color: '#333',
                    fontWeight: '600',
                    marginTop: 10,
                  }}
                >
                  Date resigned
                </p>
                <p style={{ fontSize: 18, padding: 0, margin: 0 }}>
                  {state.employee?.date_resigned ?? 'N/A'}
                </p>
              </div>
            </Flex>
          </div>
        </Flex>
      </div>
    </>
  );
}

export default StaffEmployeePreview;
