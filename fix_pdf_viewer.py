import sys
with open("src/pages/VistaPaciente.jsx", "r") as f:
    content = f.read()

old = '''          <div className="flex-1 overflow-hidden bg-[var(--color-bg-base)]">
            <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-black flex items-center justify-center pt-28">
              <div className="w-full max-w-[390px] scale-[1] zoom-1">
                <PDFViewer width="100%" height="852" showToolbar={false} style={{ width: '100%', maxWidth: '100%', objectFit: 'contain', transform: 'none', zoom: 1 }}>
                  <PatientPDF plan={patientData} />
                </PDFViewer>
              </div>
            </div>
          </div>'''

new = '''          <div className="flex-1 overflow-hidden bg-[var(--color-bg-base)]">
            <div className="w-full h-full overflow-y-auto overflow-x-hidden flex items-center justify-center pt-28">
              <div className="relative w-[390px]">
                <PDFViewer width={390} height={852} showToolbar={false}>
                  <PatientPDF plan={patientData} />
                </PDFViewer>
              </div>
            </div>
          </div>'''

if old in content:
    content = content.replace(old, new)
    with open("src/pages/VistaPaciente.jsx", "w") as f:
        f.write(content)
    print("OK")
else:
    print("NOT FOUND")
