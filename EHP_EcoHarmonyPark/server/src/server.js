import { app } from './app.js';

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API EcoHarmonyPark listening on http://localhost:${PORT}`));
