import { Modal } from 'antd';
import { useState } from 'react';

interface IModalConfirm {
    handleOk?: Function
    isModalOpen: boolean;
    title?: string;
    description: string;
}

const ModalConfirm = (props: IModalConfirm) => {
    const [isModalOpen, setIsModalOpen] = useState(props.isModalOpen);

    const handleOk = () => {
        setIsModalOpen(false);
        if(props.handleOk) {
            props.handleOk();
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    return (
        <>
            <Modal 
                title={props.title ?? "Confirm"}
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}>
                <p>{props.description}</p>
            </Modal>
        </>
    );
};

export default ModalConfirm;