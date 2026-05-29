// components/Sidebar.jsx

import { API_BASE } from "../api";
import { useState } from "react";

const NAV_ITEMS = [

  { id: "dashboard", icon: "📊", label: "Dashboard" },

  { id: "review", icon: "✅", label: "Review Records" },

  { id: "upload", icon: "📤", label: "Upload Data" },

  { id: "history", icon: "🕓", label: "Upload History" },

  { id: "failed", icon: "⚠️", label: "Failed Rows" },

  { id: "auditlog", icon: "📋", label: "Audit Log" },
];


export default function Sidebar({

  currentPage,

  onNavigate,

  pendingCount,

  failedCount,

  companies = [],

  companyId = "",

  onCompanyChange,

}) {
    const [showAddCompany, setShowAddCompany] =
    useState(false);

  const [newCompany, setNewCompany] =
    useState("");

  return (

    <div className="sidebar">


      {/* Logo */}

      <div className="sidebar-logo">

        <div className="logo-mark">

          🌿 Breathe ESG

        </div>

        <div className="logo-sub">

          Carbon Ingestion Platform

        </div>

      </div>



{/* Company Selector */}

{/* Company Selector */}

<div className="company-selector">

  <div className="company-label">
    Company
  </div>

  <select
    className="company-dropdown"
    value={companyId}
    onChange={(e)=>{

      const value = e.target.value;

      if(value==="add-company"){
        setShowAddCompany(true);
        return;
      }

      setShowAddCompany(false);

      if(onCompanyChange){
        onCompanyChange(value);
      }

    }}
  >

    {companies.map((company)=>(

      <option
        key={company.id}
        value={company.id}
      >
        {company.name}
      </option>

    ))}

    <option value="add-company">
      ➕ Add Company
    </option>

  </select>


  {showAddCompany && (

    <div className="add-company-container">

      <input
        className="company-input"
        placeholder="New company"
        value={newCompany}
        onChange={(e)=>
          setNewCompany(
            e.target.value
          )
        }
      />

      <button

        className="add-company-btn"

        onClick={async()=>{

          const name =
            newCompany.trim();

          if(!name) return;

          try{

            const res =
              await fetch(
                `${API_BASE}/companies/`,
                {
                  method:"POST",

                  headers:{
                    "Content-Type":
                      "application/json"
                  },

                  body:JSON.stringify({
                    name
                  })
                }
              );

            if(!res.ok){
              throw new Error();
            }

            setNewCompany("");
            setShowAddCompany(false);

            window.location.reload();

          }

          catch{

            alert(
              "Failed to create company"
            );

          }

        }}

      >

        Add

      </button>

    </div>

  )}

</div>

  

      {/* Navigation */}

      <div className="sidebar-nav">

        {NAV_ITEMS.map((item)=>{

          const badge =

            item.id==="review"

              ? pendingCount>0

                ? pendingCount

                : null

              : item.id==="failed"

              ? failedCount>0

                ? failedCount

                : null

              : null;

          return (

            <button

              key={item.id}

              className={`nav-item ${

                currentPage===item.id

                  ? "active"

                  : ""

              }`}

              onClick={()=>onNavigate(item.id)}

            >

              <span className="nav-icon">

                {item.icon}

              </span>

              {item.label}

              {badge && (

                <span className="nav-badge">

                  {badge}

                </span>

              )}

            </button>

          )

        })}

      </div>



      {/* Footer */}

      <div className="sidebar-footer">

        v1.0

      </div>

    </div>

  )

}