// components/UI/ErrorModal.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from "react";

interface ErrorModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ open, onClose, title = "Errore", message }) => {
    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
                <Dialog.Content
                    className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl"
                >
                    <div className="flex items-start justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-red-600">{title}</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-gray-500 hover:text-gray-700 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </Dialog.Close>
                    </div>
                    <div className="text-sm text-gray-800">{message}</div>
                    <div className="mt-6 text-right">
                        <Dialog.Close asChild>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                                Chiudi
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ErrorModal;