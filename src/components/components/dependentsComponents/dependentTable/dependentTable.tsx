import { faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { deleteDependent } from "../../../services/dependentService"; // Adicione a importação do deleteDependent
import DependentModal from "../dependentForms/dependentForms"; // Certifique-se de que o caminho está correto
import './dependentTable.css'

interface Dependent {
    id: string;
    nome: string;
}

interface DependentTableProps {
    loadDependents: () => void;
    dependents: Dependent[];
    clientId: string;
}

const DependentTable: React.FC<DependentTableProps> = ({
    loadDependents,
    dependents,
    clientId
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDependent, setEditingDependent] = useState<Dependent | null>(null);

    const handleEdit = (dependent: Dependent) => {
        setEditingDependent(dependent);
        setIsModalVisible(true);
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingDependent(null);
    }

    const handleDelete = async (dependentId: string) => {
        if (window.confirm('Deseja realmente excluir o dependente?')) {
            await deleteDependent(clientId, dependentId);
            loadDependents();
        }
    };

    return (
        <div className="table-dependent-container">
            <h2 className="table-dependent-header">DEPENDENTES</h2>
            <div className="table-dependent">
                <div className="table-dependent-row">
                    <div className="table-dependent-cell">Nome</div>
                    <div className="table-dependent-cell">Ações</div>
                </div>
                {dependents.map(dependent => (
                    <div key={dependent.id} className="table-dependent-row">
                        <div className="table-dependent-cell">{dependent.nome}</div>
                        <div className="table-dependent-cell">
                            <button className="dependent-edit-btn" onClick={() => handleEdit(dependent)}>
                                <FontAwesomeIcon icon={faWrench} />
                            </button>
                            <button className="dependent-delete-btn" onClick={() => handleDelete(dependent.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {isModalVisible && editingDependent && (
                <DependentModal
                    isVisible={isModalVisible}
                    onClose={handleCloseModal}
                    dependent={editingDependent}
                    isEditing={true}
                    loadDependentes={loadDependents}
                    clientId={clientId}
                />
            )}
        </div>
    );
};

export default DependentTable;