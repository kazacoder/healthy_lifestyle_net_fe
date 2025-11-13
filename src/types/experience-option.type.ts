export type ExperienceOptionType = {
  title: string,
  experience_from: number | undefined,
  experience_to: number | undefined,
  time_period: 'months' | 'years' | undefined,
  selected: boolean,
}
