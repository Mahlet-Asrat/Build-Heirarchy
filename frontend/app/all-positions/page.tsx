"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Table, Button, Drawer, Modal, Pagination } from "@mantine/core";
import { IconPlus, IconEdit, IconTrash, IconSettings, IconHierarchy2, IconTable, IconHome, IconMenu2 } from "@tabler/icons-react";
import NavBar from "@/components/company-context/NavBar";
import { useState } from "react";
import { useAllPositions } from "./useAllPositions";
import AddPositionForm from "@/components/add-position/add-position-form";
import UpdatePositionForm from "@/components/update-position/update-form";
import { useDeletePosition } from "@/components/delete-position/useDelete";
import DeleteModal from "@/components/delete-position/delete-modal";
import { useDisclosure } from "@mantine/hooks";

const PositionsPage = () => {
  const { positions , error, totalPages, currentPage } =
    useAllPositions();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [addOpened, setAddOpened] = useState(false);
  
  const [updateOpened, setUpdateOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
    null
  );

  const { confirmDelete, loading } = useDeletePosition(selectedPositionId);

  const openAddDrawer = (parentId: string) => {
    setSelectedParentId(parentId);
    setAddOpened(true);
  };

  const closeAddDrawer = () => {
    setAddOpened(false);
    setSelectedParentId(null);
  };

  const openUpdateDrawer = (positionId: string) => {
    setSelectedPositionId(positionId);
    setUpdateOpened(true);
  };

  const closeUpdateDrawer = () => {
    setUpdateOpened(false);
    setSelectedPositionId(null);
  };

  const openDeleteModal = (positionId: string) => {
    setSelectedPositionId(positionId);
    setDeleteOpened(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpened(false);
    setSelectedPositionId(null);
  };

  const handleConfirmDelete = async () => {
    await confirmDelete();
    closeDeleteModal();
  };
  const [opened, { open, close }] = useDisclosure(false); // Drawer state
  
  const changePage = (page: number) => {
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/all-positions?${params.toString()}`);
  };

  return (
    <>
      <Button  onClick={open} unstyled className="m-8">
        <IconTable size={24} />
      </Button>

      <Drawer opened={opened}onClose={close} position="left" size= {`xs`}  className="bg-gray-800 text-white" overlayProps={{ opacity: 0.5, blur: 4 }}>
        
        <div className="p-4 space-y-6 text-black font-bold text-xl">

        <a href="/dashboard" className="flex items-center space-x-2 hover:text-green-600">
        <IconHome size={24} />
        <span>Home</span>
      </a>
      <a href="/all-positions" className="flex items-center space-x-2 hover:text-green-600">
        <IconTable size={24} />
        <span>Positions Table</span>
      </a>

      <a href="/tree" className="flex items-center space-x-2 hover:text-green-600">
        <IconHierarchy2 size={24} />
        <span>Hierarchy</span>
      </a>

      <a href="/" className="flex items-center space-x-2 hover:text-green-600">
        <IconSettings size={24} />
        <span>Settings</span>
      </a>
        </div>
        
      </Drawer>
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-cyan-950 bg-opacity-90 z-50">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-gray-300 mt-2"> Loading Positions...</p>
        </div>
      </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : positions.length === 0 ? (
        <p className="text-center">No positions found.</p>
      ) : (
        <> 
<h1 className="text-3xl font-bold text-center text-gray-800 mb-8"> Positions Table </h1>        
<Table highlightOnHover withColumnBorders className="m-5">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Description</th>
              <th className="text-center px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.id} className="border-b">
                <td className="px-4 py-2">{position.name}</td>
                <td className="px-4 py-2">
                  {position.description || "No description"}
                </td>
                <td className="px-4 py-2 text-center flex justify-center space-x-4">
                  <Button
                    variant="light"
                    onClick={() => openAddDrawer(position.id)}
                  >
                    <IconPlus size={18} />
                  </Button>
                  <Button
                    variant="light"
                    color="green"
                    onClick={() => openUpdateDrawer(position.id)}
                  >
                    <IconEdit size={18} />
                  </Button>
                  <Button variant="light"
                    color="red"
                    onClick={() => openDeleteModal(position.id)}
                    disabled={loading}
                  >
                    <IconTrash size={18} />
                  </Button>
                  <DeleteModal opened={deleteOpened} onConfirm={handleConfirmDelete} onClose={closeDeleteModal} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </>
      )}

      {totalPages > 1 && (

        <div className="flex justify-center mt-6">

          <Pagination total={totalPages} value={currentPage} onChange={changePage} />
        </div>
      )}

      <Drawer overlayProps={{ backgroundOpacity: 0.1 }} position="right" opened={addOpened} onClose={closeAddDrawer}>
        <AddPositionForm parentId={selectedParentId} />
      </Drawer>

      <Drawer overlayProps={{ backgroundOpacity: 0.1 }}
        position="right"
        opened={updateOpened}
        onClose={closeUpdateDrawer}
      >
        {selectedPositionId && (
          <UpdatePositionForm positionId={selectedPositionId} />
        )}
      </Drawer>
    </>
  );
};

export default PositionsPage;
