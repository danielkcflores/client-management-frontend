import React, { useEffect, useState, useCallback } from 'react';
import Modal from 'react-modal';
import { createDependent, updateDependent } from '../../services/dependentService';
import Alert from '../../alert/alert';
import './dependentForms.css';

Modal.setAppElement('#root');

interface CreateDependent {
    nome: string;
}

interface Dependent extends CreateDependent {
    id: string;
}

interface DependentFormModalProps {
    isVisible: boolean;
    onClose: () => void;
    dependent: Dependent | null;
    isEditing: boolean;
    loadDependentes: () => void;
    clientId: string;
}

const DependentFormModal: React.FC<DependentFormModalProps> = ({
    isVisible,
    onClose,
    dependent,
    isEditing,
    loadDependentes,
    clientId,
}) => {
    const [nome, setNome] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const validateInput = useCallback(() => {
        if (!nome) {
            setAlertMessage('Preencha todos os campos!');
            return false;
        }
        return true;
    }, [nome]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInput()) return;

        const data: CreateDependent = { nome };

        try {
            if (isEditing && dependent?.id) {
                await updateDependent(clientId, dependent.id, data);
            } else {
                await createDependent(clientId, data);
            }

            loadDependentes();
            onClose();
            setNome('');
        } catch (error) {
            console.error('Error saving dependent', error);
            setAlertMessage('Erro ao salvar dependente');
        }
    };

    const handleAlertClose = () => {
        setAlertMessage(null);
    };

    useEffect(() => {
        if (dependent) {
            setNome(dependent.nome);
        } else {
            setNome('');
        }
    }, [dependent]);

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={onClose}
            overlayClassName="modal-dependents-overlay"
            className="modal-dependents"
            ariaHideApp={false}
        >
            <div className='modal-dependents-header'>
                <h2>{isEditing ? 'Editar Dependente' : 'Cadastrar Dependente'}</h2>
                <button onClick={onClose} className='close-btn' aria-label="Fechar modal">
                    &times;
                </button>
            </div>

            <div className="modal-dependents-form">
                {alertMessage && <Alert message={alertMessage} onClose={handleAlertClose} />}

                <form onSubmit={handleSubmit} className='dependents-form'>
                    <input
                        type='text'
                        placeholder='Nome'
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-label="Nome do dependente"
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

export default DependentFormModal;