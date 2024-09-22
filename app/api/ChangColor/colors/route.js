// app/api/ChangColor/colors/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

// Function to normalize color names
function normalizeColorName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function GET(request) {
  let connection;
  try {
    const searchParams = request.nextUrl.searchParams;
    const inputColor = searchParams.get('color');

    if (!inputColor) {
      return NextResponse.json({ error: 'Color parameter is required' }, { status: 400 });
    }

    connection = await connectToDatabase();

    // Query to get all formulas and their components
    const formulasQuery = `
      SELECT Formula.FC_Name, formula_components.CC_Name 
      FROM Formula 
      JOIN formula_components ON Formula.FC_ID = formula_components.FC_ID
    `;

    const [results] = await connection.execute(formulasQuery);

    // Process the results
    const data = {};
    for (const { FC_Name, CC_Name } of results) {
      const normalizedName = normalizeColorName(FC_Name);
      if (!data[normalizedName]) {
        data[normalizedName] = {
          originalName: FC_Name,
          components: new Set()
        };
      }
      data[normalizedName].components.add(CC_Name);
    }

    // Find matching colors
    const normalizedInputColor = normalizeColorName(inputColor);
    const selectedValue = data[normalizedInputColor];
    if (!selectedValue) {
      return NextResponse.json({ error: 'Color not found' }, { status: 404 });
    }

    const matchingColors = Object.entries(data)
      .filter(([key, value]) => 
        key !== normalizedInputColor && 
        selectedValue.components.size <= value.components.size && 
        [...selectedValue.components].every(component => value.components.has(component))
      )
      .map(([, value]) => value.originalName);

    return NextResponse.json({ 
      inputColor: selectedValue.originalName,
      matchingColors 
    });

  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}