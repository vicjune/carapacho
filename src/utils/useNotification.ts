import { OptionsObject, SnackbarKey, useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const pushNotification = useCallback(
    (message: string, options?: OptionsObject) => {
      const snackbarKey: SnackbarKey = enqueueSnackbar(message, {
        ...options,
        SnackbarProps: {
          ...options?.SnackbarProps,
          onClick: () => closeSnackbar(snackbarKey),
        },
      });
    },
    [closeSnackbar, enqueueSnackbar],
  );

  const pushError = useCallback(
    (error: any) =>
      pushNotification((error as Error)?.message || t('AN_ERROR_OCCURED'), {
        variant: 'error',
      }),
    [pushNotification, t],
  );

  return {
    pushNotification,
    pushError,
  };
};
