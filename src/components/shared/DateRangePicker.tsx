'use client';

import { format, subDays, startOfMonth, endOfMonth, isSameDay, parseISO } from 'date-fns';
import { Box, Button, TextField, IconButton, Divider } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useFilterStore } from '@/store/filterStore';

const PRESETS = [
  { label: 'Today', getRange: () => ({ start: new Date(), end: new Date() }) },
  { label: '7D', getRange: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: '30D', getRange: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: '90D', getRange: () => ({ start: subDays(new Date(), 90), end: new Date() }) },
  {
    label: 'Month',
    getRange: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }),
  },
] as const;

function isPresetActive(
  preset: (typeof PRESETS)[number],
  startDate: string,
  endDate: string
): boolean {
  const { start, end } = preset.getRange();
  try {
    return isSameDay(parseISO(startDate), start) && isSameDay(parseISO(endDate), end);
  } catch {
    return false;
  }
}

export function DateRangePicker() {
  const { startDate, endDate, setDateRange, resetDateRange } = useFilterStore();

  const handleStartChange = (value: string) => {
    if (value && endDate && value > endDate) setDateRange(value, value);
    else setDateRange(value, endDate);
  };

  const handleEndChange = (value: string) => {
    if (value && startDate && value < startDate) setDateRange(value, value);
    else setDateRange(startDate, value);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
      {PRESETS.map((preset) => {
        const active = isPresetActive(preset, startDate, endDate);
        return (
          <Button
            key={preset.label}
            size="small"
            variant={active ? 'contained' : 'outlined'}
            onClick={() => {
              const { start, end } = preset.getRange();
              setDateRange(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
            }}
            sx={{
              minWidth: 'auto',
              px: 1,
              py: 0.25,
              fontSize: '0.6875rem',
              lineHeight: 1.5,
              ...(active ? {} : { color: 'text.secondary', borderColor: 'divider' }),
            }}
          >
            {preset.label}
          </Button>
        );
      })}
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' } }} />
      <TextField
        type="date"
        size="small"
        value={startDate}
        onChange={(e) => handleStartChange(e.target.value)}
        inputProps={{ max: endDate }}
        sx={{ width: 130, '& input': { fontSize: '0.75rem', py: 0.75 } }}
      />
      <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
        –
      </Box>
      <TextField
        type="date"
        size="small"
        value={endDate}
        onChange={(e) => handleEndChange(e.target.value)}
        inputProps={{ min: startDate }}
        sx={{ width: 130, '& input': { fontSize: '0.75rem', py: 0.75 } }}
      />
      <IconButton size="small" onClick={resetDateRange} title="Reset to last 30 days">
        <RestartAltIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
