"use client";
import { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useTree } from "./useRenderTree";
import { Button, Drawer } from "@mantine/core";
import {
  IconHierarchy2,
  IconHome,
  IconMenu2,
  IconSettings,
  IconTable,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const PosTree = () => {

  const { treeData, fetchChildren, loading, error } = useTree();
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [expandedState, setExpandedState] = useState<{
    [key: string]: boolean;
  }>({});

  const [opened, { open, close }] = useDisclosure(false);

  const handleExpand = async (nodeId: string) => {

    if (expandedNodes[nodeId]) {
      setExpandedState((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
      return;
    }

    const children = await fetchChildren(nodeId);

    setExpandedNodes((prev) => ({ ...prev, [nodeId]: children }));

    setExpandedState((prev) => ({ ...prev, [nodeId]: true }));
  };

  const renderTree = (nodes: any[] | null, level = 0) => {

    if (!Array.isArray(nodes)) return null;

    return (
      <>
        <ul
          style={{
            paddingLeft: `${level * 20}px`,
            listStyle: "none",
            margin: "5px 0",
          }}
        >
          {nodes.map((node) => (
            <li key={node.id} style={{ marginBottom: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <span
                  onClick={() => handleExpand(node.id)}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {expandedState[node.id] ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
                <span
                  onClick={() => handleExpand(node.id)}
                  style={{ fontWeight: "bold" }}
                >
                  {node.name}
                </span>
              </div>

              {expandedNodes[node.id] && expandedState[node.id] && (
                <div
                  style={{
                    marginLeft: "10px",
                    borderLeft: "2px solid #ccc",
                    paddingLeft: "10px",
                  }}
                >
                  {renderTree(expandedNodes[node.id], level + 1)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "20px auto",
      }}
    >
      <div className="flex justify-between items-center w-full">
        <Button onClick={open} unstyled className="m-8">
          <IconHierarchy2 size={24} />
        </Button>
        <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-3 flex-grow">
          Positions Heirarchy
        </h1>
      </div>

      <Drawer opened={opened} onClose={close} position="left"size={`xs`}  className="bg-gray-800 text-white" overlayProps={{ opacity: 0.5, blur: 4 }}>
        <div className="p-4 space-y-6 text-black font-bold text-xl">
          <a href="/dashboard" className="flex items-center space-x-2 hover:text-green-600">
            <IconHome size={24} />
            <span>Home</span>
          </a>
          <a
            href="/all-positions"
            className="flex items-center space-x-2 hover:text-green-600"
          >
            <IconTable size={24} />
            <span>Positions Table</span>
          </a>

          <a
            href="/tree"
            className="flex items-center space-x-2 hover:text-green-600"
          >
            <IconHierarchy2 size={24} />
            <span>Hierarchy</span>
          </a>

          <a
            href="/"
            className="flex items-center space-x-2 hover:text-green-600"
          >
            <IconSettings size={24} />
            <span>Settings</span>
          </a>
        </div>
      </Drawer>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {renderTree(treeData)}
      
    </div>
  );
};

export default PosTree;
