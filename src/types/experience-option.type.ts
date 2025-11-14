export type ExperienceOptionType = {
  id: string,
  title: string,
  experience_from: number | undefined,
  experience_to: number | undefined,
  experience_period: 'months' | 'years' | undefined,
  selected: boolean,
}
