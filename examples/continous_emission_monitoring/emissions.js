// Establish if CO2 concentration provided
if (typeof(stack_co2_concentration) === 'undefined') {
  stack_co2_concentration = null;
}

// Establish if oxygen concentration provided
if (typeof(stack_o2_concentration) === 'undefined') {
  stack_o2_concentration = null;
}

// Establish CO2 concentration using oxygen as proxy if necessary
if (stack_o2_concentration == null && stack_co2_concentration == null) {
  stack_co2_concentration = 0;
} else if (stack_co2_concentration == null) {
  stack_co2_concentration = (1.0 / ambient_o2_concentration) * (fc_factor / f_factor) * ((ambient_o2_concentration * (1 - stack_gas_moisture)) - stack_o2_concentration);
}

// Calculate volumetric CO2 emissions rate
volume_co2_per_time = stack_co2_concentration * stack_flow_rate * (1 - stack_gas_moisture);

// Calculate mass-based CO2 emissions rate
mass_co2_per_time = volume_co2_per_time * co2_density;

// Calculate total CO2 emissions
co2 = mass_co2_per_time * operating_time;