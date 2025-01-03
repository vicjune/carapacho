import { Box, FormControl, MenuItem, Select, SxProps } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const AppBar: FC<{ sx?: SxProps }> = ({ sx }) => {
  const { i18n } = useTranslation();

  const languages = Object.keys(i18n.options.resources || {});

  return (
    <Box sx={{ display: 'flex', p: 2, ...sx }}>
      <FormControl sx={{ ml: 'auto' }}>
        <Select
          size="small"
          value={i18n.resolvedLanguage}
          onChange={({ target }) => {
            i18n.changeLanguage(target.value);
          }}
        >
          {languages.map((language) => (
            <MenuItem key={language} value={language}>
              {language.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
