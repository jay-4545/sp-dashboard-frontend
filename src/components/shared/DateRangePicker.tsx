'use client';

import { format, subDays, startOfMonth, endOfMonth, isSameDay, parseISO, isValid } from 'date-fns';
import { Box, Button, IconButton, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useFilterStore } from '@/store/filterStore';
import { fontSize } from '@/theme/theme';

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

const pickerFieldSx = {
  width: { xs: 96, sm: 108 },
  '& .MuiInputBase-root': {
    pr: 0.25,
    minHeight: 28,
    fontSize: fontSize.xs,
  },
  '& .MuiInputBase-input': {
    py: 0.375,
    px: 0.75,
    fontSize: fontSize.xs,
  },
  '& .MuiPickersSectionList-root, & .MuiPickersInputBase-section': {
    fontSize: fontSize.xs,
  },
  '& .MuiIconButton-root': { p: 0.375 },
  '& .MuiSvgIcon-root': { fontSize: 16 },
};

function parseStoredDate(value: string): Date | null {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

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
  const startValue = parseStoredDate(startDate);
  const endValue = parseStoredDate(endDate);

  const handleStartChange = (value: Date | null) => {
    if (!value) return;
    const nextStart = format(value, 'yyyy-MM-dd');
    if (endDate && nextStart > endDate) setDateRange(nextStart, nextStart);
    else setDateRange(nextStart, endDate);
  };

  const handleEndChange = (value: Date | null) => {
    if (!value) return;
    const nextEnd = format(value, 'yyyy-MM-dd');
    if (startDate && nextEnd < startDate) setDateRange(nextEnd, nextEnd);
    else setDateRange(startDate, nextEnd);
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
              px: 0.625,
              py: 0.125,
              fontSize: fontSize.xs,
              lineHeight: 1.35,
              ...(active ? {} : { color: 'text.secondary', borderColor: 'divider' }),
            }}
          >
            {preset.label}
          </Button>
        );
      })}

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' } }} />

      <DatePicker
        value={startValue}
        onChange={handleStartChange}
        maxDate={endValue ?? undefined}
        format="dd/MM/yyyy"
        slotProps={{
          textField: {
            size: 'small',
            placeholder: 'Start',
            sx: pickerFieldSx,
          },
          openPickerButton: { size: 'small' },
        }}
      />

      <Box component="span" sx={{ color: 'text.disabled', fontSize: fontSize.xs, px: 0.25 }}>
        –
      </Box>

      <DatePicker
        value={endValue}
        onChange={handleEndChange}
        minDate={startValue ?? undefined}
        format="dd/MM/yyyy"
        slotProps={{
          textField: {
            size: 'small',
            placeholder: 'End',
            sx: pickerFieldSx,
          },
          openPickerButton: { size: 'small' },
        }}
      />

      <IconButton size="small" onClick={resetDateRange} title="Reset to last 30 days" sx={{ p: 0.25 }}>
        <RestartAltIcon sx={{ fontSize: 13 }} />
      </IconButton>
    </Box>
  );
}
