export type DurationOptionType = {
  id: string,
  title: string,
  duration_from: number | undefined,
  duration_to: number | undefined,
  duration_period: 'hours' | 'days' | undefined,
  selected: boolean,
}
