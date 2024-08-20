import React, { useEffect, useState, useCallback } from 'react';
import Modal from 'react-modal';
import { createTelephone, updateTelephone } from '../../services/telephoneService';
import Alert from '../../alert/alert';
import './telephoneForms.css';

Modal.setAppElement('#root');

interface CreateTelephone {
    numero: string;
}

interface Telephone extends CreateTelephone {
    id: string;
}

interface TelephoneFormModalProps {
    isVisible: boolean;
    onClose: () => void;
    telephone: Telephone | null;
    isEditing: boolean;
    loadTelephones: () => void;
    clientId: string;
}

const TelephoneFormModal: React.FC<TelephoneFormModalProps> = ({
    isVisible,
    onClose,
    telephone,
    isEditing,
    loadTelephones,
    clientId,
}) => {
    const [numero, setNumero] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleNumeroMask = useCallback((value: string): string => {
        const digits = value.replace(/\D/g, '');
        return digits.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }, []);

    const validateInput = useCallback(() => {
        const unmaskedNumber = numero.replace(/\D/g, '');
        if (!unmaskedNumber) {
            setAlertMessage('Preencha todos os campos!');
            return false;
        }

        if (unmaskedNumber.length !== 11) {
            setAlertMessage('Telefone deve ter 11 dígitos!');
            return false;
        }

        return true;
    }, [numero]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInput()) return;

        const data: CreateTelephone = { numero: numero.replace(/\D/g, '') }; // Enviar apenas números

        try {
            if (isEditing && telephone?.id) {
                await updateTelephone(clientId, telephone.id, data);
            } else {
                await createTelephone(clientId, data);
            }

            loadTelephones();
            onClose();
            setNumero('');
        } catch (error) {
            console.error('Error saving telephone', error);
            setAlertMessage('Erro ao salvar telefone');
        }
    };

    const handleAlertClose = () => {
        setAlertMessage(null);
    };

    useEffect(() => {
        if (telephone) {
            setNumero(telephone.numero);
        } else {
            setNumero('');
        }
    }, [telephone]);

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={onClose}
            overlayClassName="modal-telephones-overlay"
            className="modal-telephones"
            ariaHideApp={false}
        >
            <div className='modal-telephones-header'>
                <h2>{isEditing ? 'Editar Telephone' : 'Cadastrar Telephone'}</h2>
                <button onClick={onClose} className='close-btn' aria-label="Fechar modal">
                    &times;
                </button>
            </div>

            <div className="modal-telephones-form">
                {alertMessage && <Alert message={alertMessage} onClose={handleAlertClose} />}

                <form onSubmit={handleSubmit} className='telephones-form'>
                    <input
                        type='text'
                        placeholder='Telefone...'
                        value={handleNumeroMask(numero)} // Aplica a máscara ao valor exibido
                        onChange={(e) => setNumero(handleNumeroMask(e.target.value))} // Aplica a máscara ao digitar
                        aria-label="Numero do telefone"
                    />
                    <div className='form-buttons'>
                        <button type='submit'>
                            {isEditing ? 'Atualizar' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default TelephoneFormModal;