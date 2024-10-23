interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

function Modal({ isOpen, onClose, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
