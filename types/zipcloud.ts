export interface ZipCloudAddress {
  zipcode: string
  prefcode: string
  address1: string
  address2: string
  address3: string
  kana1: string
  kana2: string
  kana3: string
}

export interface ZipCloudResponse {
  message: string | null
  results: ZipCloudAddress[] | null
  status: number
}
