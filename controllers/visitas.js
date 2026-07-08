import supabase from "../config/db.js";

const RESULTADOS_VALIDOS = ['interesado', 'no_interesado', 'neutro']
const PROXIMO_PASO_VALIDOS = ['send_info_prog', 'prog_seguimiento', 'coordinar_visita']

export const getVisitas = (req, res) => {
    res.json({"mensaje": "Desde getVisitas."})
}

export const checkIn = async (req, res) => {
    const { agente_id, lead_id, lat, lng, transcripcion, resultado, proximo_paso, proximo_contacto_at, fotos, audio_url } = req.body

    // Validando agente_id
    if (!agente_id) {
        return res.status(400).json({ error: 'Falta agente_id' })
    }

    // Validando coordenadas
    if (typeof lat !== 'number' || typeof lng !== 'number') {
        return res.status(400).json({ error: 'lat y lng son requeridos y deben ser numeros' })
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ error: 'lat/lng fuera de rango' })
    }

   // Validar fecha
   if(proximo_contacto_at !== undefined && isNaN(new Date(proximo_contacto_at).getTime())) {
        return res.status(400).json({ error: 'proximo_contacto_at no es una fecha válida' })
   }

    // Validar resultado
    if (resultado !== undefined && !RESULTADOS_VALIDOS.includes(resultado)) {
        return res.status(400).json({ error: 'Resultado inválido.' })
    }

    // Validar proximo paso
    if (proximo_paso !== undefined && !PROXIMO_PASO_VALIDOS.includes(proximo_paso)) {
        return res.status(400).json({ error: 'Proximo Paso inválido.' })
    }

    // Validar fotos
    if(fotos !== undefined && !Array.isArray(fotos)) {
        return res.status(400).json({ error: 'fotos debe ser un arreglo de URLs' })
    }

    // Validar audio_url
    if (audio_url !== undefined && typeof audio_url !== 'string') {
        return res.status(400).json({ error: 'audio_url debe ser un texto' })
    }

    try {
        const { data: visita, error } = await supabase
            .from('Visit')
            .insert({
                agente_id,
                lead_id: lead_id ?? null,
                lat,
                lng,
                checkin_at: new Date().toISOString(),
                transcripcion: transcripcion ?? null,
                resultado: resultado ?? null,
                proximo_paso: proximo_paso ?? null,
                proximo_contacto_at: proximo_contacto_at ?? null,
                fotos: fotos ?? [],
                audio_url: audio_url ?? null
            })
            .select()
            .single()

        if (error) throw error

        res.status(201).json({ data: visita })
    } catch (error) {
        console.error('checkIn error:', error)
        res.status(500).json({ error: 'No se pudo registrar el check-in' })
    }
}

export const updateVisita = async (req, res) => {
    const {id} = req.params
    const {resultado, proximo_paso, proximo_contacto_at} = req.body

    if (resultado !== undefined && !RESULTADOS_VALIDOS.includes(resultado)) {
        return res.status(400).json({ error: 'Resultado inválido.' })
    }
    
    const cambios = {}
    if (resultado !== undefined) cambios.resultado = resultado
    if (proximo_paso !== undefined) cambios.proximo_paso = proximo_paso
    if (proximo_contacto_at !== undefined) cambios.proximo_contacto_at = proximo_contacto_at
    
    if (Object.keys(cambios).length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar.' })
    }

    try {

        if (resultado !== undefined) {
            const { data: visitaActual, error: errorConsulta } = await supabase
                .from('Visit')
                .select('lead_id')
                .eq('id', id)
                .single()

            if (errorConsulta) throw errorConsulta

            if (!visitaActual.lead_id) {
                return res.status(400).json({ error: 'No se puede marcar resultado sin un cliente asociado a la visita' })
            }  
        }

        const { data: visita, error } = await supabase
        .from('Visit')
        .update(cambios)
        .eq('id', id)
        .select()
        .single()

        if (error) throw error

        res.status(200).json({ data: visita })
    } catch (error) {
        console.error('updateVisita error:', error)

        if (error.code === 'PGRST116') {
            return res.status(404).json({ error: 'Visita no encontrada' })
        }

        res.status(500).json({ error: 'No se pudo actualizar la visita' })
    }
}