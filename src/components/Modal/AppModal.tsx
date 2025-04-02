import * as Dialog from '@radix-ui/react-dialog';
import {X} from 'lucide-react';
import * as React from "react";
import {useNavigate} from "react-router-dom";

export interface AppModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    secondaryButtonLabel?: string;
    hideCloseButton?: boolean;
    primaryButton?: {
        label: string;
        link?: string;
        action?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    } | null
}

const AppModal: React.FC<AppModalProps> = ({
                                               open,
                                               onClose,
                                               title = "Errore",
                                               message,
                                               secondaryButtonLabel,
                                               hideCloseButton = false,
                                               primaryButton = null,
                                           }) => {
    const navigate = useNavigate();

    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"/>
                <Dialog.Content
                    className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl"
                >
                    <div className="flex items-start justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-red-600">{title}</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-gray-500 hover:text-gray-700 transition">
                                <X className="w-5 h-5"/>
                            </button>
                        </Dialog.Close>
                    </div>
                    <div className="text-sm text-gray-800">{message}</div>

                    {(primaryButton || !hideCloseButton) && (
                        <div className="mt-6 flex justify-end gap-2">
                            {primaryButton && primaryButton.link && primaryButton.link.trim() !== "" && (
                                <Dialog.Close asChild>
                                    {
                                        primaryButton.link && primaryButton.link.trim() !== "" &&
                                        <button
                                            onClick={() => navigate(primaryButton.link as string)}
                                            className="px-4 py-2 bg-[#D4AF37] hover:bg-yellow-600 text-white rounded-md font-medium transition cursor-pointe"
                                        >
                                            {primaryButton.label}
                                        </button>
                                    }
                                </Dialog.Close>
                            )}

                            {primaryButton && primaryButton.action != undefined && (
                                <Dialog.Close asChild>

                                    <button
                                        onClick={(e) => primaryButton.action && primaryButton.action(e)}
                                        className="px-4 py-2 bg-[#D4AF37] hover:bg-yellow-600 text-white rounded-md font-medium transition cursor-pointer"
                                    >
                                        {primaryButton.label}
                                    </button>
                                </Dialog.Close>
                            )}

                            {
                                !hideCloseButton && (
                                    <Dialog.Close asChild>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer">
                                            {secondaryButtonLabel ? secondaryButtonLabel : 'Chiudi'}
                                        </button>
                                    </Dialog.Close>
                                )
                            }
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AppModal;