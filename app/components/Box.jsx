const Box = ({ title }) => {
  return (
    <div className="border border-purple-300 bg-purple-50 p-4 rounded-lg shadow-sm hover:shadow-md transition w-60">
      <h3 className="font-semibold text-lg text-purple-700">
        {title}
      </h3>
    </div>
  )
}

export default Box