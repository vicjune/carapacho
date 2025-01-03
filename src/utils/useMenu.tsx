import { Menu } from '@mui/material';
import {
  DependencyList,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useModal } from 'react-modal-hook';

export type AnchorEl = Element | null | undefined;

export function useMenu<T = void>(
  component: ReactNode | ((props: T | undefined) => ReactNode),
  inputs?: DependencyList,
) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<AnchorEl>(null);
  const [props, setProps] = useState<T | undefined>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [openModal, closeModal] = useModal(
    () => (
      <Menu open={open} onClose={closeMenu} anchorEl={anchorEl}>
        {typeof component === 'function' ? component(props) : component}
      </Menu>
    ),
    [...(inputs || []), open, anchorEl, props],
  );

  const openMenu = useCallback(
    (event: { currentTarget: AnchorEl }, customProps?: T) => {
      clearTimeout(timeoutRef.current);
      setProps(() => customProps);
      setAnchorEl(event.currentTarget);
      setOpen(true);
      openModal();
    },
    [openModal],
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    timeoutRef.current = setTimeout(() => {
      closeModal();
      setAnchorEl(null);
      setProps(undefined);
    }, 500);
  }, [closeModal]);

  return [openMenu, closeMenu] as [
    (
      event: {
        currentTarget: AnchorEl;
      },
      customProps?: T,
    ) => void,
    () => void,
  ];
}
