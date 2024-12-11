import { alpha, Box, SxProps } from '@mui/material';
import { FC } from 'react';
import {
  ActionCardBase,
  CardSuitId,
  Card as CardType,
  CardTypeId,
  cardTypes,
  UnitCardBase,
} from '../utils/cards';

const HEIGHT = 500;
const WIDTH = HEIGHT * 0.7159090909;

export const Card: FC<{
  card: CardType;
  sx?: SxProps;
  scale?: number;
}> = ({ card, sx, scale = 1 }) => {
  const scaled = (number: number) => number * scale;

  const getTextFontSize = () => {
    const totalLength = (card.base.text || '').length + card.suit.text.length;

    if (totalLength > 300) {
      return 12;
    }

    if (totalLength > 200) {
      return 14;
    }

    return 16;
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
        '-webkit-print-color-adjust': 'exact !important',
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
          <Box sx={{ fontSize: scaled(40) }}>
            {cardTypes.find(({ id }) => id === card.type)?.title}
          </Box>
          {card.type === CardTypeId.UNIT && (
            <Box
              sx={{
                fontSize: scaled(22),
                bgcolor: 'grey',
                borderRadius: scaled(3),
                px: scaled(2),
                py: scaled(0.5),
                color: 'white',
              }}
            >
              valeur{' '}
              <Box component="span" sx={{ fontWeight: 'bold' }}>
                {(card.base as UnitCardBase).value}
              </Box>
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
          {card.base.text && (
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
                dangerouslySetInnerHTML={{
                  __html: card.base.text,
                }}
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
              dangerouslySetInnerHTML={{
                __html: `${card.suit.text}${
                  card.type === CardTypeId.ACTION &&
                  card.suit.id === CardSuitId.HEART
                    ? (card.base as ActionCardBase).improvedText
                    : ''
                }`,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
