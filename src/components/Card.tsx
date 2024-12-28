import { Bolt } from '@mui/icons-material';
import { alpha, Box, SxProps } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionCard,
  Card as CardInterface,
  CardTypeId,
  UnitCard,
} from '../types/Card';

const HEIGHT = 500;
const WIDTH = HEIGHT * 0.7159090909;

export const Card: FC<{
  card: CardInterface;
  sx?: SxProps;
  scale?: number;
}> = ({ card, sx, scale = 1 }) => {
  const { t } = useTranslation();

  const scaled = (number: number) => number * scale;

  const baseText = t(`CARD.${card.type}.BASE.${card.base.id}.TEXT`);
  const suitText = `${t(`CARD.${card.type}.SUIT.${card.suit.id}.TEXT`)}${
    card.type === CardTypeId.ACTION && (card as ActionCard).improved
      ? ` ${t(`CARD.${card.type}.BASE.${card.base.id}.IMPROVED_TEXT`)}`
      : ''
  }`;

  const getTextFontSize = () => {
    const totalLength = baseText.length + suitText.length;

    if (totalLength > 300) {
      return 12;
    }

    if (totalLength > 200) {
      return 14;
    }

    if (totalLength > 100) {
      return 16;
    }

    return 18;
  };

  return (
    <Box
      key={card.id}
      sx={{
        display: 'flex',
        height: scaled(HEIGHT),
        width: scaled(WIDTH),
        flexDirection: 'column',
        textAlign: 'center',
        borderRadius: scaled(4),
        backgroundImage: `url(../../assets/cards/${card.id.toLowerCase()}.png)`,
        backgroundSize: `${scaled(WIDTH)}px ${scaled(HEIGHT)}px`,
        border: '1px solid black',
        overflow: 'hidden',
        breakInside: 'avoid',
        WebkitPrintColorAdjust: 'exact',
        '@media print': {
          backgroundImage: 'none',
          height: 'auto',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          border: '1px dashed gray',
          m: 0.2,
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          background: `linear-gradient(0deg, ${alpha('#fff', 0.9)}, ${alpha(
            '#fff',
            0.9,
          )} 80%, ${alpha('#fff', 0)})`,
          pt: scaled(8),
          mt: 'auto',
          '@media print': {
            pt: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: scaled(2),
          }}
        >
          <Box
            sx={{
              fontSize: scaled(40),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ mr: scaled(1) }}>{t(`CARD.TYPE.${card.type}`)}</Box>
          </Box>
          {card.type === CardTypeId.UNIT ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  fontSize: scaled(14),
                  bgcolor: 'grey',
                  borderTopLeftRadius: scaled(4),
                  borderBottomLeftRadius: scaled(4),
                  px: scaled(1),
                  py: scaled(0.2),
                  color: 'white',
                  mr: scaled(-1),
                  zIndex: 1,
                }}
              >
                {t('VALUE')}
              </Box>
              <Box
                component="span"
                sx={{
                  fontWeight: 'bold',
                  bgcolor: 'grey',
                  fontSize: scaled(28),
                  color: 'white',
                  borderRadius: '50%',
                  height: scaled(40),
                  width: scaled(40),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {(card as UnitCard).base.value}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                bgcolor: 'grey',

                color: 'white',
                borderRadius: '50%',
                height: scaled(40),
                width: scaled(40),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bolt sx={{ color: 'white', fontSize: scaled(30) }} />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            height: scaled(200),
            p: scaled(2),
            pt: 0,
            fontSize: scaled(getTextFontSize()),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {baseText && (
            <Box sx={{ mb: scaled(1) }}>
              <Box
                sx={{
                  fontWeight: 'bold',
                  mr: scaled(1),
                  fontSize: scaled(getTextFontSize() + 2),
                  color: 'white',
                  bgcolor: 'gray',
                  px: scaled(0.8),
                  py: scaled(0.2),
                  borderRadius: scaled(1),
                }}
                component="span"
              >
                {card.base.title}
              </Box>
              <Box
                component="span"
                dangerouslySetInnerHTML={{ __html: baseText }}
              />
            </Box>
          )}
          <Box>
            <Box
              sx={{
                fontWeight: 'bold',
                mr: scaled(1),
                fontSize: scaled(getTextFontSize() + 2),
              }}
              component="span"
            >
              {card.suit.title}
            </Box>
            <Box
              component="span"
              dangerouslySetInnerHTML={{ __html: suitText }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
