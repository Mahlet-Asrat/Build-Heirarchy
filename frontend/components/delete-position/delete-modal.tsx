import { Modal, Button, Text } from "@mantine/core";

const DeleteModal = ({ opened, onConfirm, onClose }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Delete" centered >
      <Text size="md" className="mb-4">
        Are you sure you want to delete this position?
      </Text>
      <div className="flex justify-end space-x-4 mt-4">
        <Button variant="outline" onClick={onClose}>
          No
        </Button>
        <Button color="red" onClick={onConfirm}>
          Yes
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
