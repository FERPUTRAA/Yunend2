import { getAccessToken, getCurrentlyPlaying } from "@/lib/spotify"

export async function GET() {
  try {
    const { access_token } = await getAccessToken()
    const response = await getCurrentlyPlaying(access_token)

    if (!response || response.status === 204 || response.status > 400) {
      return new Response(JSON.stringify({ isPlaying: false }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      })
    }

    const song = {
      isPlaying: response.is_playing,
      title: response.item.name,
      artist: response.item.artists.map((_artist: any) => _artist.name).join(", "),
      album: response.item.album.name,
      albumImageUrl: response.item.album.images[0].url,
      songUrl: response.item.external_urls.spotify,
    }

    return new Response(JSON.stringify(song), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error in now-playing route:', error)
    return new Response(JSON.stringify({ isPlaying: false }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    })
  }
}