import { faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { deleteTelephone } from '../../../services/telephoneService'
import TelephoneFormModal from "../telephoneForms/telephoneForms";
import './telephoneTable.css'

interface Telephone {
    id: string;
    numero: string;
}

interface TelephoneTableProps {
    loadTelephones: () => void;
    telephones: Telephone[];
    clientId: string;
}

const TelephoneTable: React.FC<TelephoneTableProps> = ({
    loadTelephones,
    telephones,
    clientId
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTelephone, setEditingTelephone] = useState<Telephone | null>(null);

    const handleEdit = (telephone: Telephone) => {
        setEditingTelephone(telephone);
        setIsModalVisible(true);
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingTelephone(null);
    }

    const handleDelete = async (telephoneId: string) => {
        if (window.confirm('Deseja realmente excluir o telefone?')) {
            await deleteTelephone(clientId, telephoneId);
            loadTelephones();
        }
    };

    return (
        <div className="table-telephone-container">
            <h2 className="table-telephone-header">TELEFONES</h2>
            <div className="table-telephone">
                <div className="table-telephone-row">
                    <div className="table-telephone-cell">Número</div>
                    <div className="table-telephone-cell">Ações</div>
                </div>
                {telephones.map(telephone => (
                    <div key={telephone.id} className="table-telephone-row">
                        <div className="table-telephone-cell">{telephone.numero}</div>
                        <div className="table-telephone-cell">
                            <button className="telephone-edit-btn" onClick={() => handleEdit(telephone)}>
                                <FontAwesomeIcon icon={faWrench} />
                            </button>
                            <button className="telephone-delete-btn" onClick={() => handleDelete(telephone.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {isModalVisible && editingTelephone && (
                <TelephoneFormModal
                    isVisible={isModalVisible}
                    onClose={handleCloseModal}
                    telephone={editingTelephone}
                    isEditing={true}
                    loadTelephones={loadTelephones}
                    clientId={clientId}
                />
            )}
        </div>
    );
};

export default TelephoneTable;