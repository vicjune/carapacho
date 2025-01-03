import {
  DependencyList,
  ReactElement,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useModal } from 'react-modal-hook';

export function useDialog<T = void>(
  component: (
    open: boolean,
    customProps: T | undefined,
  ) => ReactElement<any, any> | null,
  inputs?: DependencyList,
) {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<T | undefined>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [openModal, closeModal] = useModal(
    () => component(open, props),
    [...(inputs || []), open, props],
  );

  const openDialog = useCallback(
    (customProps?: T) => {
      clearTimeout(timeoutRef.current);
      setProps(() => customProps);
      setOpen(true);
      openModal();
    },
    [openModal],
  );

  const closeDialog = useCallback(() => {
    setOpen(false);
    timeoutRef.current = setTimeout(() => {
      closeModal();
      setProps(undefined);
    }, 500);
  }, [closeModal]);

  return [openDialog, closeDialog] as [(customProps?: T) => void, () => void];
}
