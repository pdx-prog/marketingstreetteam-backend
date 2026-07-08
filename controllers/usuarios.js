import supabase from "../config/db.js";

export const getUsuarios = async (req, res) => {
    try {
        const {data: allUsuarios, error} = await supabase
        .from('User')
        .select('*')

        if (error) throw error

        res.status(200).json({data: allUsuarios})
    } catch (error) {
        console.log('getUsuarios error:', error)
        res.status(500).json({error: 'No se pudo obtener los usuarios' })
    }
}

export const getRutas = (req, res) => {
    res.json({"mensaje": "Desde getURutas."})
}

export const getLeads = (req, res) => {
    res.json({"mensaje": "Desde getLeads."})
}