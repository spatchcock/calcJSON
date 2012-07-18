if (typeof(mass) != 'undefined') { 
  co2 = mass * mass_co2_per_mass; 
} else if (typeof(volume) != 'undefined') { 
  co2 = volume * density * mass_co2_per_mass;
} else { 
  co2 = energy / heating_value * mass_co2_per_mass;
}