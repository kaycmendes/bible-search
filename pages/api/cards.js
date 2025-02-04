import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { createClient } from '@supabase/supabase-js'

// Create admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
)

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // GET - Fetch all cards for user
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('cards')
      .select('*')
      .eq('user_email', session.user.email)
      .order('created_at', { ascending: false })
      
    if (error) {
      console.error('Fetch error:', error)
      return res.status(400).json({ error: error.message })
    }
    return res.json(data)
  }

  // POST - Save new card
  if (req.method === 'POST') {
    const { data, error } = await supabaseAdmin
      .from('cards')
      .insert([
        { 
          user_email: session.user.email,
          verse: req.body.verse,
          verse_location: req.body.verseLocation,
          query: req.body.query,
          version: req.body.version
        }
      ])
      .select()
      
    if (error) {
      console.error('Save error:', error)
      return res.status(400).json({ error: error.message })
    }
    return res.json(data[0])
  }

  // DELETE - Remove a card
  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('cards')
      .delete()
      .eq('verse_location', req.query.verse_location)
      .eq('user_email', session.user.email)
      
    if (error) {
      console.error('Delete error:', error)
      return res.status(400).json({ error: error.message })
    }
    return res.status(200).json({ success: true })
  }

  // PATCH - Sync local cards with database
  if (req.method === 'PATCH') {
    const localCards = req.body.cards
    
    try {
      // First, get existing cards
      const { data: existingCards } = await supabase
        .from('cards')
        .select('verse_location')
        .eq('user_email', session.user.email)

      // Filter out cards that already exist
      const existingLocations = new Set(existingCards.map(c => c.verse_location))
      const newCards = Object.values(localCards).filter(
        card => !existingLocations.has(card.verseLocation)
      )

      if (newCards.length === 0) {
        return res.json({ message: 'No new cards to sync' })
      }

      // Insert new cards
      const { data, error } = await supabase
        .from('cards')
        .insert(newCards.map(card => ({
          user_email: session.user.email,
          verse: card.verse,
          verse_location: card.verseLocation,
          query: card.query,
          version: card.version
        })))
        .select()

      if (error) throw error
      return res.json({ synced: data.length })
    } catch (error) {
      console.error('Sync error:', error)
      return res.status(400).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
} 