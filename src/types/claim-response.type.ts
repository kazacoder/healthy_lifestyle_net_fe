export type ClaimResponseType = {
  id: number,
  event?: number,
  master?: number,
  claimer: number,
  claimer_full_name: string,
  claimer_photo: string,
  text: string,
  created_at: string,
  answerer: number | null,
  answer: string | null,
  answered_at: string | null,
  read: boolean
}
