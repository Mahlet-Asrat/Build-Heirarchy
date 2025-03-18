"use client";

import { useState } from "react";
import { 
    Table, Button, Drawer, Modal, TextInput, Group, Pagination, Loader, Box, Title 
} from "@mantine/core";
import { IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import NavBar from "@/components/company-context/NavBar";
import AddPositionForm from "@/components/add-position/add-position-form";
import UpdatePositionForm from "@/components/update-position/update-form";
import DeleteModal from "@/components/delete-position/delete-modal";
import { useDeletePosition } from "@/components/delete-position/useDelete";
import { useSearch } from "./useSearch";
import { useDisclosure } from "@mantine/hooks";
import AddAnyPositionForm from "@/components/add-any-position/add-any-pos";
import PosTree from "../tree/page";
import PositionsPage from "../all-positions/page";

export default function SearchPositions() {
    const { searchQuery, setSearchQuery, results, loading, error, handleSearch } = useSearch();
    
    const [opened, { open, close }] = useDisclosure(false);
    const [addOpened, setAddOpened] = useState(false);
    const [updateOpened, setUpdateOpened] = useState(false);
    const [deleteOpened, setDeleteOpened] = useState(false);
    const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState("table");

    const { confirmDelete, loading: deleting } = useDeletePosition(selectedPositionId);

    const openAddDrawer = () => setAddOpened(true);
    const closeAddDrawer = () => setAddOpened(false);

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

    const toggleViewMode = () => {
        
        setViewMode((prevMode) => (prevMode === "hierarchy" ? "table" : "hierarchy"));
    };

    return (
        <> 
        {/* <NavBar/> */}

        <div className="min-h-screen bg-gray-200 p-6">

            <Box className="rounded-lg  mx-3 mt-2">

                <div className="flex justify-between"> 
                <Title order={1} className="text-center mb-6 text-2xl font-bold text-gray-800">
                    Build Hierarchy
                </Title>

                <Box className=" ">
                    <Button 
                        unstyled 
                        className="bg-blue-900 text-white text-3xl p-3 hover:bg-blue-700 hover:cursor-pointer rounded-full" 
                        onClick={open}
                    >
                        Add Position
                    </Button>
                </Box>
                </div>

                <Group className="mt-8 flex justify-between gap-40">
                    <TextInput 
                        placeholder="Search Positions..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        onKeyDown={(e) => {
                            if (e.key === "Enter"){
                                handleSearch()
                            }
                        }} rightSection={<IconSearch size={20} />} className="w-lvh py-3 text-lg"  styles={{ input: { height: "3rem", fontSize: "1.1rem" }}}/>

                    <Button  unstyled className={`text-lg p-3 text-white font-semibold ${viewMode === "hierarchy"  ? "bg-green-600 hover:bg-green-700 hover:cursor-pointer"  : "bg-amber-600 hover:bg-amber-900 hover:cursor-pointer"} rounded-2xl transition-colors duration-200`} 
                        onClick={toggleViewMode} >
                        {viewMode === "hierarchy" ? "See Hierarchy" : "See Table"}

                    </Button>
        </Group>

                <Drawer position="right" opened={opened} onClose={close}>
                    <AddAnyPositionForm />
                </Drawer>
            </Box>

            {loading && <Loader className="mx-auto" size="sm" />}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {results.length > 0 ? (
                <>
                    <Table highlightOnHover withColumnBorders className="shadow-lg mt-4">
                        <thead>
                            <tr>
                                <th className="text-left px-4 py-2">Name</th>
                                <th className="text-left px-4 py-2">Description</th>
                                <th className="text-center px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((position) => (
                                <tr key={position.id} className="border-b">
                                    <td className="px-4 py-2">{position.name}</td>
                                    <td className="px-4 py-2">
                                        {position.description || "No description"}
                                    </td>
                                    <td className="px-4 py-2 text-center flex justify-center space-x-4">
                                        <Button variant="light" onClick={openAddDrawer}>
                                            <IconPlus size={18} />
                                        </Button>
                                        <Button variant="light" color="green" onClick={() => openUpdateDrawer(position.id)}>
                                            <IconEdit size={18} />
                                        </Button>
                                        <Button variant="light" color="red" onClick={() => openDeleteModal(position.id)} disabled={deleting}>
                                            <IconTrash size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            ) : (
                !loading && <p className="text-center text-gray-500"></p>
            )}

           

            <Box className="mt-8">
                {viewMode === "hierarchy" ? <PositionsPage /> : <PosTree />}
            </Box>

            <Drawer overlayProps={{ backgroundOpacity: 0.1 }} position="right" opened={addOpened} onClose={closeAddDrawer}>
                <AddPositionForm parentId={selectedPositionId} />
            </Drawer>

            <Drawer overlayProps={{ backgroundOpacity: 0.1 }} position="right" opened={updateOpened} onClose={closeUpdateDrawer}>
                {selectedPositionId && <UpdatePositionForm positionId={selectedPositionId} />}
            </Drawer>

            <DeleteModal opened={deleteOpened} onConfirm={handleConfirmDelete} onClose={closeDeleteModal} />
        </div>
        </>
    );
}
