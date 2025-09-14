import { createElement } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

/**
 * Enum pour les types de balises meta supportées
 */
export enum MetaTagType {
	// Balises meta de base
	DESCRIPTION = 'description',
	KEYWORDS = 'keywords',
	AUTHOR = 'author',
	VIEWPORT = 'viewport',
	ROBOTS = 'robots',
	CHARSET = 'charset',

	// Open Graph
	OG_TITLE = 'og:title',
	OG_DESCRIPTION = 'og:description',
	OG_IMAGE = 'og:image',
	OG_URL = 'og:url',
	OG_TYPE = 'og:type',
	OG_SITE_NAME = 'og:site_name',
	OG_LOCALE = 'og:locale',

	// Twitter Cards
	TWITTER_CARD = 'twitter:card',
	TWITTER_SITE = 'twitter:site',
	TWITTER_CREATOR = 'twitter:creator',
	TWITTER_TITLE = 'twitter:title',
	TWITTER_DESCRIPTION = 'twitter:description',
	TWITTER_IMAGE = 'twitter:image',

	// SEO avancé
	CANONICAL = 'canonical',
	THEME_COLOR = 'theme-color',
	MSAPPLICATION_TILECOLOR = 'msapplication-TileColor',

	// Autres
	GENERATOR = 'generator',
	APPLICATION_NAME = 'application-name',
	REFERRER = 'referrer',
}

/**
 * Interface pour définir une balise meta personnalisée
 */
export interface MetaTag {
	key: MetaTagType
	value: string
}

/**
 * Interface pour les options du hook useMetadata
 */
export interface MetadataOptions {
	title?: string
	description?: string
	keywords?: string
	customMetas?: MetaTag[]
	includeCanonical?: boolean
	ogImage?: string
	twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
}

/**
 * Configuration par défaut pour les métadonnées
 */
const DEFAULT_CONFIG = {
	siteName: 'Minecraft Servers',
	author: 'Minecraft Servers',
	viewport: 'width=device-width, initial-scale=1.0',
	defaultDescription: 'Minecraft Servers',
	defaultKeywords: 'minecraft, servers, minecraft servers',
	baseUrl:
		typeof window !== 'undefined'
			? window.location.origin
			: 'https://minecraftservers.com',
	defaultOgImage: '/og-image.jpg',
	twitterSite: '@minecraftservers',
}

/**
 * Composant Helmet personnalisé qui utilise react-helmet-async en interne
 * Ce composant est utilisé par le hook useMetadata
 */
export const MetadataHelmet = ({
	title,
	description = DEFAULT_CONFIG.defaultDescription,
	keywords = DEFAULT_CONFIG.defaultKeywords,
	customMetas = [],
	includeCanonical = true,
	ogImage = DEFAULT_CONFIG.defaultOgImage,
	twitterCard = 'summary_large_image',
}: MetadataOptions) => {
	const location = useLocation()
	const currentUrl = `${DEFAULT_CONFIG.baseUrl}${location.pathname}`
	const fullTitle = title
		? `${title} | ${DEFAULT_CONFIG.siteName}`
		: DEFAULT_CONFIG.siteName
	const fullOgImage = ogImage.startsWith('http')
		? ogImage
		: `${DEFAULT_CONFIG.baseUrl}${ogImage}`

	const standardMetas: Array<{ name: string; content: string }> = []
	const propertyMetas: Array<{ property: string; content: string }> = []
	const linkTags: Array<{ rel: string; href: string }> = []

	standardMetas.push(
		{ name: 'description', content: description },
		{ name: 'keywords', content: keywords },
		{ name: 'author', content: DEFAULT_CONFIG.author },
		{ name: 'viewport', content: DEFAULT_CONFIG.viewport },
	)

	propertyMetas.push(
		{ property: 'og:title', content: fullTitle },
		{ property: 'og:description', content: description },
		{ property: 'og:image', content: fullOgImage },
		{ property: 'og:url', content: currentUrl },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: DEFAULT_CONFIG.siteName },
		{ property: 'og:locale', content: 'fr_FR' },
	)

	standardMetas.push(
		{ name: 'twitter:card', content: twitterCard },
		{ name: 'twitter:site', content: DEFAULT_CONFIG.twitterSite },
		{ name: 'twitter:title', content: fullTitle },
		{ name: 'twitter:description', content: description },
		{ name: 'twitter:image', content: fullOgImage },
	)

	if (includeCanonical) {
		linkTags.push({ rel: 'canonical', href: currentUrl })
	}

	customMetas.forEach(({ key, value }) => {
		if (key === MetaTagType.CANONICAL) {
			linkTags.push({ rel: 'canonical', href: value })
		} else if (key.startsWith('og:')) {
			propertyMetas.push({ property: key, content: value })
		} else {
			standardMetas.push({ name: key, content: value })
		}
	})

	return createElement(Helmet, {
		children: [
			title && createElement('title', { key: 'title' }, fullTitle),

			...standardMetas.map(meta =>
				createElement('meta', { key: `meta-${meta.name}`, ...meta }),
			),

			...propertyMetas.map(meta =>
				createElement('meta', {
					key: `property-${meta.property}`,
					...meta,
				}),
			),

			...linkTags.map(link =>
				createElement('link', {
					key: `link-${link.rel}-${link.href}`,
					...link,
				}),
			),
		].filter(Boolean),
	})
}

/**
 * Hook personnalisé pour gérer les métadonnées de manière automatique
 * Utilise react-helmet-async en interne pour une meilleure compatibilité SEO
 * @param options - Options de configuration des métadonnées
 */
export const useMetadata = (options: MetadataOptions = {}) => {
	const location = useLocation()

	const currentUrl = `${DEFAULT_CONFIG.baseUrl}${location.pathname}`
	const fullTitle = options.title
		? `${options.title} | ${DEFAULT_CONFIG.siteName}`
		: DEFAULT_CONFIG.siteName

	// Retourner le composant Helmet et des utilitaires
	return {
		helmet: createElement(MetadataHelmet, options),
		currentUrl,
		siteName: DEFAULT_CONFIG.siteName,
		fullTitle,
	}
}

/**
 * Hook simplifié pour les cas d'usage basiques
 * @param title - Titre de la page
 * @param description - Description de la page (optionnelle)
 */
export const useSimpleMetadata = (title: string, description?: string) => {
	return useMetadata({ title, description })
}

/**
 * Fonction utilitaire pour générer des métadonnées Open Graph pour les réseaux sociaux
 */
export const generateSocialMetas = (
	title: string,
	description: string,
	image: string,
): MetaTag[] => {
	return [
		{ key: MetaTagType.OG_TITLE, value: title },
		{ key: MetaTagType.OG_DESCRIPTION, value: description },
		{ key: MetaTagType.OG_IMAGE, value: image },
		{ key: MetaTagType.TWITTER_TITLE, value: title },
		{ key: MetaTagType.TWITTER_DESCRIPTION, value: description },
		{ key: MetaTagType.TWITTER_IMAGE, value: image },
		{ key: MetaTagType.TWITTER_CARD, value: 'summary_large_image' },
	]
}
