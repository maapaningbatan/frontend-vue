
<script setup lang="ts">


</script>
<template>
  <div class="p-6 bg-gray-100 text-gray-800">

    <!-- Actions Toolbar -->
    <div class="no-print mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6 bg-white p-6 rounded-xl shadow">
      <!-- Date Inputs -->
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div class="flex flex-col">
          <label class="text-sm font-semibold text-gray-700">From</label>
          <input type="date" class="mt-1 w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"/>
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-semibold text-gray-700">To</label>
          <input type="date" class="mt-1 w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"/>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <button class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 shadow">Generate</button>
        <button class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 shadow">Reset</button>
        <button class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 shadow">Print</button>
        <button class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 shadow">Back</button>
      </div>
    </div>

    <!-- Headers -->
    <div class="text-center font-bold text-lg">PROPERTY RECORDS AND EQUIPMENT MONITORING INVENTORY SYSTEM</div>
    <div class="text-center font-bold text-lg">SEMI-EXPANDABLE CARD</div>
    <div class="text-center font-bold text-lg mb-6">as of — to —</div>

    <!-- Supply Details -->
    <div class="w-full px-2 text-sm flex flex-wrap gap-y-2 mb-2">
      <div class="flex items-center w-full md:w-1/2 pr-4">
        <span class="font-medium text-base mr-2 whitespace-nowrap">Entity Name:</span>
        <div class="flex-1 border-b border-gray-500 h-5"></div>
      </div>
      <div class="flex items-center w-full md:w-1/2 pr-4">
        <span class="font-medium text-base mr-2 whitespace-nowrap">Fund Cluster:</span>
        <div class="flex-1 border-b border-gray-500 h-5"></div>
      </div>
    </div>

    <!-- Boxed Section -->
    <div class="border border-black text-sm w-full mb-4">
      <div class="border-b border-gray-800 px-2 py-2 font-medium">
        Property, Plant and Equipment: <strong>—</strong>
      </div>
      <div class="px-2 py-2 font-medium">
        Description: <strong>Sample Item Description</strong>
      </div>
    </div>

    <!-- Semi-Expandable Card Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-xs border-collapse border border-black">
        <thead class="bg-gray-200">
          <tr>
            <th>Date</th>
            <th>Reference No.</th>
            <th>Reference Type</th>
            <th>Quantity</th>
            <th>Unit Cost</th>
            <th>Total</th>
            <th>Balance</th>
            <th>Accountability</th>
            <th>Office</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <!-- Sample Row -->
          <tr>
            <td>Jan-01-25</td>
            <td>PO123</td>
            <td>Delivery</td>
            <td>10</td>
            <td>500.00</td>
            <td>5000.00</td>
            <td>10</td>
            <td>Office A</td>
            <td>Main Office</td>
            <td>Initial Stock</td>
          </tr>

          <!-- Empty State -->
          <tr>
            <td colspan="10" class="text-center text-gray-500 py-4">
              Please select a date range and click <strong>Generate</strong>.
            </td>
          </tr>

          <!-- Nothing Follows -->
          <tr>
            <td colspan="10" class="text-center font-semibold text-gray-600 py-2">
              x-x-x-x-x-x-x-x-x-x-x-x-NOTHING FOLLOWS-x-x-x-x-x-x-x-x-x-x-x-x
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
// Design-only, no functionality
</script>

<style scoped>
@media print {
  @page { size: A4 landscape; }
  body { font-size: 11px; }
  .no-print { display: none !important; }
  table tr { page-break-inside: avoid; }
}
table, th, td {
  border: 1px solid black;
}
th, td {
  padding: 3px;
  text-align: center;
}
</style>
