export interface TranslationService {
  isConfigured: boolean
  translateText(text: string): Promise<string>
  translateList(texts: string[]): Promise<string[]>
}
