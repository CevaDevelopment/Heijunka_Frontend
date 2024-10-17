import { useState } from "react";
import { HeijunkaLayout } from "../layout/HeijunkaLayout";
import { AdminManager, AdminView } from "../views"; // Asegúrate de que estos componentes están importados correctamente
import AssignmentTable from "../views/AssignmentTable";

export const HeijunkaPage = () => {
  // Estado para el módulo seleccionado y las tareas asignadas
  const [selectedModule, setSelectedModule] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState([]);

  // Función que renderiza el módulo correspondiente según el estado seleccionado
  const renderSelectedModule = () => {
    switch (selectedModule) {
      case 0:
        return <AdminView />;
      case 1:
        return <AdminManager setAssignedTasks={setAssignedTasks} />;
      case 2:
        return <AssignmentTable tasks={assignedTasks} />;
      default:
        return <AdminView />;
    }
  };

  return (
    // Paso la función onSelectModule a través del layout
    <HeijunkaLayout onSelectModule={setSelectedModule}>
      {renderSelectedModule()}
    </HeijunkaLayout>
  );
};
