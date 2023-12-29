export default function Transfer({address}:{address:string}) {
  return (
    <form onSubmit={() => {}} className="flex flex-col gap-4">
      <div className="input-box">
        <div className="input-box_head">
          <div className="input-box_label">Receiving address (taproot)</div>
        </div>
        <div className="input-box_wrap">
          <input
            name="receivingAddress"
            placeholder="Enter a taproot address from an ordinals wallet"
            className="input-box_inp py-2 px-6 bg-gray-800 h-12 rounded-lg w-full text-white"
          />
        </div>
      </div>
      <div className="input-box">
        <div className="input-box_head">
          <div className="input-box_label">Ticker</div>
        </div>
        <div className="input-box_wrap">
          <input
            placeholder="e.g. ordi"
            name="ticker"
            className="input-box_inp py-2 px-6 bg-gray-800 h-12 rounded-lg w-full text-white"
            v-model="data.ticker"
          />
        </div>
      </div>
      <div className="input-box">
        <div className="input-box_head">
          <div className="input-box_label">Amount</div>
        </div>
        <div className="input-box_wrap">
          <input
            placeholder="e.g. 1000"
            name="amount"
            className="input-box_inp py-2 px-6 bg-gray-800 h-12 rounded-lg w-full text-white"
          />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <button
          type="submit"
          className="bg-white px-6 py-3 w-2/3 flex text-black rounded-lg text-center justify-center hover:bg-gray-700 hover:text-white transition-colors border border-black hover:border-white text-xl"
        >
          Inscribe
        </button>
      </div>
    </form>
  );
}
